import {AfterViewInit, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MessageService} from "primeng/api";
import {ApexAxisChartSeries} from 'ng-apexcharts';
import {chart, grid, plotOptions, yAxis} from '../../shared/boxSettings';
import {Device, Operation, ReadRequestBody} from "../../../../generated/models";
import {LineState} from "../../../components/line/model/line.model";
import {ApiService} from "../../../../generated/services/api.service";
import {InfluxQueryResult} from "influx-aws-lambda/api/influxTypes";
import {
  createSensors, extractDataFromDeviceDefinition,
  minMaxSeries,
  parseOtherParams,
  pushOrInsertArray,
  toBoxData
} from "../../shared/tranformFunctions";
import {Bullet} from "../../model/dashboards.model";

@Component({
  selector: 'app-statistic-device-detail-dashboard',
  templateUrl: './statistic-device-detail-dashboard.component.html',
  styleUrls: ['./statistic-device-detail-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class StatisticDeviceDetailDashboard implements OnInit, AfterViewInit {
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
  sparklineData: any[] = [];
  otherData: any[] = [];
  kpis: any[] = []
  timer: any;

  boxData = [] as {name: string, data: ApexAxisChartSeries }[];

  sparklineMaxMin: any = [];
  plotOptions = plotOptions;
  chart = chart;
  yAxis = yAxis;
  grid = grid;

  constructor(private apiService: ApiService, private messageService: MessageService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.lineState.device = this.device;
    this.extractDataFromInputs();
    this.updateMainChart();
    this.updateSparklines(this.sparklines || []);
    this.updateBoxPlots(this.sparklines || []);
  }

  private updateSparklines(sparklines: string[]) {
    const {sensors} = createSensors(this.device, this.lineState, sparklines);
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
        const {storage, thresholdLines} = this.createStorage(this.lineState, items, sparklines, this.sparklineMapping);
        this.sparklineMaxMin = thresholdLines;
        this.updatePreviousValue(storage);
        const parsedStorage = Object.entries(storage).map(([id, data]) => Object.entries(data).map(([measurement, series]) => ({id, measurement, series})));
        const sparklineData = {} as any;
        for (const sensor of parsedStorage) {
          for (const measurement of sensor) {
            const value = {name: this.getDeviceName(measurement.measurement, measurement.id), series: measurement.series};

            pushOrInsertArray(measurement.measurement, sparklineData, value)
          }
        }
        this.sparklineData = Object.values(sparklineData);
      } else {
        this.messageService.add({severity: "error", summary: "Could not retrieve data", detail: "Data could not be updated"});
      }
    });
  }

  private updatePreviousValue(storage: { [sensor: string]: { [field: string]: any[]; }; }) {
    const data = Object.entries(storage).filter(([key, _]) => key !== this.device?.deviceUid);

    if (!data.length) {
      this.bullets.forEach(bullet => bullet.previousValue = bullet.value);
      return;
    }

    const takePreviousValuesFromStorage = data[0][1];

    this.bullets.forEach(bullet => {
      const items = takePreviousValuesFromStorage[`${bullet.name} ${bullet.units}`];
      const lastItem = items[items.length - 1];
      bullet.previousValue = lastItem.value;
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
      const {storage} = this.createStorage(this.lineState, items, boxPlotFieldNames, this.sparklineMapping);
      const boxSeries = Object.entries(storage[this.device?.deviceUid as string]).reduce((previous, [name, series]) => {
        const items = toBoxData(series as any[]);

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

    const otherData = this.device.parameterValues?.filter(value => typeof value.number != "number" || value.visibility != 3) || [];

    this.otherData.push(...otherData.map(param => parseOtherParams(param)));
    this.extractOtherDataFromDeviceDefinition();

    this.lineState.allKpis.push(...this.sparklines.map((field) => ({name: this.sparklineMapping(field), field: field})));
    this.lineState.selectedKpis.push(...this.fields.map(field => ({name: this.sparklineMapping(field), field})));
    this.lineState.dates.push(from, new Date());
  }

  private extractOtherDataFromDeviceDefinition() {
    this.otherData.push(...extractDataFromDeviceDefinition(this.device));
  }

  private updateMainChart() {
    const {fields, sensorIds, sensors} = createSensors(this.device, this.lineState, this.lineState.selectedKpis.map(kpi => kpi.field));
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
        const {storage} = this.createStorage(this.lineState, items, fields, this.sparklineMapping);
        this.lineState.results = this.handleMultipleLines(sensorIds, storage);
        console.log(this.lineState);
      } else {
        this.messageService.add({severity: "error", summary: "Could not retrieve data", detail: "Data could not be updated"});
      }
    });
  }

  private handleMultipleLines(sensorIds: any[], storage: { [p: string]: { [p: string]: any[] } }) {
    if (!sensorIds.length) {
      return Object.entries(storage[this.device?.deviceUid as string]).map(([name, series]) => ({
        name: name,
        series: series
      }));
    }

    return Object.entries(storage).map(([id, fieldStorage]) => {
      return Object.entries(fieldStorage).map(([measurement, series]) =>
        ({name: this.getDeviceName(measurement, id), series: series})
      )
    }).reduce((previousValue, currentValue) => {
      previousValue.push(...currentValue);
      return previousValue;
    }, [] as any[]);
  }

  private getDeviceName(measurement: string, id: string) {
    if (!this.lineState.selectedDevicesToCompareWith.length)
      return measurement;

    return `${[...this.lineState.allDevices, {
      id: this.device.deviceUid,
      name: this.device.deviceName
    }].find(device => device.id === id)?.name || id}: ${measurement}`
  }

  private createStorage(lineState: LineState, items: InfluxQueryResult, fields: string[], mapping: (name: string) => string): { thresholdLines: { [p: string]: { value: number; name: string }[] }; storage: {[sensor: string]: {[field: string]: any[]}}} {
    const storage = Object.fromEntries(
      [...lineState.selectedDevicesToCompareWith.map((device: { id: any; }) => device.id), lineState.device.deviceUid].map(key =>
        [key, Object.fromEntries(fields.map(field => [mapping(field), []]))]
      )
    );

    const thresholdLines = {} as {[field: string]: {value: number, name: string}[]};

    items.data.forEach((item: { [x: string]: any; sensor: string | number; time: string | number | Date; }) => {
      fields.forEach(field => {
        thresholdLines[mapping(field)] = minMaxSeries(lineState.device, field)
        storage[item.sensor][mapping(field)].push({value: Number(item[field]).toFixed(2), name: new Date(item.time)});
      })
    });
    return {storage, thresholdLines};
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
