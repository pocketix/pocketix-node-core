import { Component, OnInit } from '@angular/core';
import {
  createMappingFromParameterValues,
  createSensors,
  createStorage, handleMultipleLines, parameterValueToBullet,
  storageToSparklines, toBoxData, twoDatesAndPointCountToAggregationMinutes,
  updatePreviousValue
} from "../../library/dashboards/shared/tranformFunctions";
import {Operation} from "../../generated/models/operation";
import {ReadRequestBody} from "../../generated/models/read-request-body";
import {LineState} from "../../library/components/line/model/line.model";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {BulletsState, SparklineState} from "../../library/dashboards/model/dashboards.model";
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {Device} from "../../generated/models/device";
import {InfluxService} from "../../generated/services/influx.service";
import {MessageService} from "primeng/api";
import {DeviceService} from "../../generated/services/device.service";
import {environment} from "../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {Storage} from "../../library/dashboards/model/dashboards.model"

@Component({
  selector: 'app-base-dashboard',
  templateUrl: './base-dashboard.component.html',
  styleUrls: ['./base-dashboard.component.css'],
  providers: [MessageService]
})
export class BaseDashboardComponent implements OnInit {
  mapping!: (string: string) => string
  title = 'dip';
  bucket = environment.bucket;
  devices: Device[] = [];
  fields!: string[];
  sparklines!: string[];
  protected deviceUid: string = "";
  protected type: string = "";
  device!: Device;
  lineState = {
    allAggregationOperations: Object.values(Operation).filter(item => isNaN(Number(item)) && item !== 'none'),
    selectedAggregationOperation: Operation.Mean.toString(),
    allKpis: [],
    selectedKpis: [],
    dates: [],
    allDevices: [],
    selectedDevicesToCompareWith: [],
    results: [],
    device: this.device
  } as LineState;

  boxData = [] as {name: string, data: ApexAxisChartSeries }[];

  bulletsState = {
    data: [],
    device: this.device
  } as BulletsState

  sparklineState = {
    device: this.device,
    data: [] as any[],
    minMax: {} as {[p: string]: DataItem[] }
  } as SparklineState

  constructor(private route: ActivatedRoute,
              protected influxService: InfluxService,
              protected deviceService: DeviceService,
              protected messageService: MessageService) { }

  async ngOnInit() {
    this.type = this.route.snapshot.params["type"] ?? "";
    this.deviceUid = this.route.snapshot.queryParams["deviceUid"];

    const devicesPromise = this.deviceService.getDevicesByDeviceType({
      deviceType: this.type
    }).toPromise();

    const devicePromise = this.deviceService.getDeviceById({
      deviceUid: this.deviceUid
    }).toPromise();

    [this.device, this.devices] = await Promise.all([devicePromise, devicesPromise]);
    this.lineState.device = this.device;
    this.bulletsState.device = this.device;
    this.sparklineState.device = this.device;

    this.fields = this.device.parameterValues?.map(parameterValues => parameterValues.type.name) || [];
    this.sparklines = this.fields;
    this.fields = this.fields.slice(0, 3);
    this.bulletsState.data = this.device.parameterValues?.map(parameterValueToBullet) || [];
    this.mapping = createMappingFromParameterValues(this?.device?.parameterValues || []);


    this.extractDataFromInputs();
    this.updateMainChart();
    this.updateSparklines(this.sparklines || []);
    this.updateBoxPlots(this.sparklines || []);
  }

  private updateSparklines(sparklines: string[]) {
    const {sensors} = createSensors(this.lineState, sparklines);
    const from = new Date();
    const to = new Date();
    to.setHours(23, 59, 59 , 999);
    from.setDate(from.getDate() - 30);
    this.influxService.aggregate({
      operation: Operation.Mean,
      from: from.toISOString(),
      to: to.toISOString(),
      aggregateMinutes: 1440,
      body: {
        bucket: this.bucket,
        sensors
      } as ReadRequestBody
    }).subscribe(items => {
      if (items?.data) {
        const {storage, thresholdLines} = createStorage(this.lineState, items, sparklines, this.mapping);
        updatePreviousValue(this.bulletsState, storage);
        const sparklineData = storageToSparklines(this.lineState, storage);
        this.sparklineState.minMax = thresholdLines;
        this.sparklineState.data = Object.values(sparklineData);
      } else {
        this.messageService.add({severity: "error", summary: "Could not retrieve data", detail: "Data could not be updated"});
      }
    });
  }

  private updateBoxPlots(boxPlotFieldNames: string[]) {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    this.influxService.aggregate({
      operation: Operation.Mean,
      from: from.toISOString(),
      to: new Date().toISOString(),
      aggregateMinutes: 1440,
      body: {
        bucket: this.bucket,
        sensors: {[this.device?.deviceUid as string]: boxPlotFieldNames}
      } as ReadRequestBody
    }).subscribe(items => {
      const {storage} = createStorage(this.lineState, items, boxPlotFieldNames, this.mapping);
      const typeCasted = storage as Storage;
      const boxSeries = Object.entries(typeCasted[this.device?.deviceUid as string]).reduce((previous, [name, series ]) => {
        const items = toBoxData(series);

        if (items)
          previous.push({name, data: [{data: [{x: name, y: items}]}]});

        return previous;
      }, [] as {name: string, data: ApexAxisChartSeries }[]);
      this.boxData.push(...boxSeries);
    }, error => console.log(error))
  }

  private extractDataFromInputs() {
    this.devices = this.devices?.filter(device => device.deviceUid !== this.device.deviceUid);
    this.lineState.allDevices.push(...this.devices?.map(device => ({name: device.deviceName, id: device.deviceUid})) as any[]);
    const from = new Date();
    from.setDate(from.getDate() - 7);
    this.lineState.allKpis.push(...this.sparklines.map((field) => ({name: this.mapping(field), field: field})));
    this.lineState.selectedKpis.push(...this.fields.map(field => ({name: this.mapping(field), field})));
    this.lineState.dates.push(from, new Date());
  }

  public updateMainChart() {
    const {fields, sensorIds, sensors} = createSensors(this.lineState, this.lineState.selectedKpis.map(kpi => kpi.field));
    let from, to;

    if (!(this.lineState.dates.length > 1)) {
      from = new Date(this.lineState.dates[0].setHours( 0, 0, 0, 0));
      to = new Date(this.lineState.dates[0].setHours(23, 59, 59 ,999));
      this.lineState.dates = [from, to];
    }

    from = this.lineState.dates[0];
    to = this.lineState.dates[this.lineState.dates.length - 1];

    const aggregationMinutes = twoDatesAndPointCountToAggregationMinutes(from, to, 300);

    this.influxService.aggregate({
      operation: this.lineState.selectedAggregationOperation as Operation,
      aggregateMinutes: aggregationMinutes,
      from: from.toISOString(),
      to: to.toISOString(),
      body: {bucket: this.bucket, sensors}
    }).subscribe(items => {
      if (items?.data) {
        const {storage} = createStorage(this.lineState, items, fields, this.mapping);
        this.lineState.results = handleMultipleLines(this.lineState, sensorIds, storage);
      } else {
        this.messageService.add({severity: "error", summary: "Could not retrieve data", detail: "Data could not be updated"});
      }
    });
  }

  public onMainChartUpdate() {
    this.updateMainChart();
    this.updateSparklines(this.sparklines);
    this.updateBoxPlots(this.sparklines);
  }
}
