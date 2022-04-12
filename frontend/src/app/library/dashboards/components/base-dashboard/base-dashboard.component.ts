import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../generated/models/device";
import {Bullet, BulletsState} from "../../model/dashboards.model";
import {Operation} from "../../../../generated/models/operation";
import {LineState} from "../../../components/line/model/line.model";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {chart, grid, plotOptions, yAxis } from '../../shared/boxSettings';
import {
  createSensors,
  createStorage,
  handleMultipleLines, storageToSparklines,
  toBoxData,
  updatePreviousValue
} from "../../shared/tranformFunctions";
import {ReadRequestBody} from "../../../../generated/models/read-request-body";
import {ApiService} from "../../../../generated/services/api.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-base-dashboard',
  templateUrl: './base-dashboard.component.html',
  styleUrls: ['./base-dashboard.component.css']
})
export class BaseDashboardComponent implements OnInit, AfterViewInit {
  @Input() device!: Device;
  @Input() bucket: string = "";
  @Input() fields: string[] = [];
  @Input() devices?: Device[];
  @Input() bullets: Bullet[] = [];
  @Input() sparklineMapping = (name: string) => name;
  @Input() sparklines: string[] = [];

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

  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Value';
  otherData: any[] = [];
  timer: any;

  boxData = [] as {name: string, data: ApexAxisChartSeries }[];

  bulletsState = {
    data: [],
    device: this.device
  } as BulletsState

  sparklineState = {
    device: this.device,
    data: [] as any[],
    minMax: {} as {[p: string]: DataItem[] }
  }

  plotOptions = plotOptions;
  chart = chart;
  yAxis = yAxis;
  grid = grid;

  constructor(private apiService: ApiService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.lineState.device = this.device;
    this.bulletsState.device = this.device;
    this.bulletsState.data = this.bullets;
    this.extractDataFromInputs();
    this.updateMainChart();
    this.updateSparklines(this.sparklines || []);
    this.updateBoxPlots(this.sparklines || []);
  }

  private updateSparklines(sparklines: string[]) {
    const {sensors} = createSensors(this.lineState, sparklines);
    const from = new Date();
    from.setDate(from.getDate() - 3);
    this.apiService.aggregate({
      operation: Operation.Mean,
      from: from.toISOString(),
      to: new Date().toISOString(),
      aggregateMinutes: 288,
      body: {
        bucket: this.bucket,
        sensors,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      } as ReadRequestBody
    }).subscribe(items => {
      if (items?.data) {
        const {storage, thresholdLines} = createStorage(this.lineState, items, sparklines, this.sparklineMapping);
        updatePreviousValue(this.bulletsState,storage);
        const sparklineData = storageToSparklines(this.lineState, storage);
        this.sparklineState.minMax = thresholdLines;
        this.sparklineState.data = Object.values(sparklineData)
      } else {
        this.messageService.add({severity: "error", summary: "Could not retrieve data", detail: "Data could not be updated"});
      }
    });
  }

  private updateBoxPlots(boxPlotFieldNames: string[]) {
    const from = new Date();
    from.setDate(from.getDate() - 3);
    this.apiService.aggregate({
      operation: Operation.Mean,
      from: from.toISOString(),
      to: new Date().toISOString(),
      aggregateMinutes: 288,
      body: {
        bucket: this.bucket,
        sensors: {[this.device?.deviceUid as string]: boxPlotFieldNames},
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      } as ReadRequestBody
    }).subscribe(items => {
      const {storage} = createStorage(this.lineState, items, boxPlotFieldNames, this.sparklineMapping);
      const boxSeries = Object.entries(storage[this.device?.deviceUid as string]).reduce((previous, [name, series]) => {
        const items = toBoxData(series);

        if (items)
          previous.push({name, data: [{data: [{x: name, y: items}]}]});

        return previous;
      }, [] as any[]);
      this.boxData.push(...boxSeries);
    }, error => console.log(error))
  }

  private extractDataFromInputs() {
    this.devices = this.devices?.filter(device => device.deviceUid !== this.device.deviceUid);
    this.lineState.allDevices.push(...this.devices?.map(device => ({name: device.deviceName, id: device.deviceUid})) as any[]);
    const from = new Date();
    from.setDate(from.getDate() - 7);
    this.lineState.allKpis.push(...this.sparklines.map((field) => ({name: this.sparklineMapping(field), field: field})));
    this.lineState.selectedKpis.push(...this.fields.map(field => ({name: this.sparklineMapping(field), field})));
    this.lineState.dates.push(from, new Date());
  }

  protected updateMainChart() {
    const {fields, sensorIds, sensors} = createSensors(this.lineState, this.lineState.selectedKpis.map(kpi => kpi.field));
    const from = this.lineState.dates[0].toISOString();
    const to = this.lineState.dates[this.lineState.dates.length - 1].toISOString();

    this.apiService.aggregate({
      operation: this.lineState.selectedAggregationOperation as Operation,
      aggregateMinutes: 30,
      from,
      to,
      body: {bucket: this.bucket, sensors}
    }).subscribe(items => {
      if (items?.data) {
        const {storage} = createStorage(this.lineState, items, fields, this.sparklineMapping);
        this.lineState.results = handleMultipleLines(this.lineState, sensorIds, storage);
      } else {
        this.messageService.add({severity: "error", summary: "Could not retrieve data", detail: "Data could not be updated"});
      }
    });
  }

  onReloadSwitch($event: any) {
    if ($event.checked) {
      return this.timer = setInterval(() => this.updateMainChart(), 5000);
    }
    return clearInterval(this.timer);
  }

  onMainGraphChange() {
    this.updateMainChart();
  }
}
