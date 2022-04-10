import {AfterViewInit, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import {MessageService} from "primeng/api";
import {ApexAxisChartSeries} from 'ng-apexcharts';
import {chart, grid, plotOptions, yAxis} from './boxSettings';
import {Device, Operation, ParameterValue, ReadRequestBody} from "../../../../generated/models";
import {LineState} from "../../../components/line/model/line.model";
import {ApiService} from "../../../../generated/services/api.service";
import {InfluxQueryResult} from "influx-aws-lambda/api/influxTypes";

export type Bullet = {
  value: number;
  max: number;
  min: number;
  previousValue: number;
  thresholds: number[];
  units: string;
  name: string;
}

@Component({
  selector: 'app-statistic-device-detail-dashboard',
  templateUrl: './statistic-device-detail-dashboard.component.html',
  styleUrls: ['./statistic-device-detail-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class StatisticDeviceDetailDashboard implements OnInit, AfterViewInit {
  @Input() device: Device = {
    description: "", lastSeenDate: "", latitude: 0, longitude: 0, registrationDate: "",
    deviceName: '',
    deviceUid: '',
    parameterValues: []
  };
  @Input() bucket: string = "";
  @Input() fields: string[] = [];
  @Input() devices?: Device[];
  @Input() bullets: Bullet[] = [];
  @Input() sparklineMapping = (name: string) => name; // [parameter.mnParameter?.devParName, `${parameter.mnParameter?.label} ${parameter.mnParameter?.unit}`]
  @Input() sparklines: string[] = [];

  lineState = {
    selectedAggregationOperation: Operation.Mean.toString(),
    selectedKpis: [] as { [key: string]: string }[],
    dates: [] as Date[],
    selectedDevicesToCompareWith: [] as any[]
  } as LineState;

  aggregationOperations = Object.values(Operation).filter(item => isNaN(Number(item)) && item !== 'none');
  currentOperation = Operation.Mean.toString();

  results: any[] = [];
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Value';
  sparklineData: any[] = [];
  otherData: any[] = [];
  kpis: any[] = [];
  devicesOptions: any[] = [];
  timer: any;

  boxData = [] as ApexAxisChartSeries[];

  sparklineMaxMin: any = [];
  selectedDevicesToCompareWith: any;
  plotOptions = plotOptions;
  chart = chart;
  yAxis = yAxis;
  grid = grid;

  constructor(private apiService: ApiService, private messageService: MessageService) {
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.extractDataFromInputs();
    this.updateMainChart();
    this.displayImage();
    this.updateSparklines(this.sparklines || []);
    this.updateBoxPlots(this.sparklines || []);
  }

  private displayImage(): void {
    const image = document.getElementById("image");
    if (image)
      image.setAttribute("src", this.device?.image || "");
  }

  private updateSparklines(sparklines: string[]) {
    const {sensors} = this.createSensors(sparklines)
    const from = new Date();
    from.setDate(from.getDate() - 30);
    this.apiService.aggregate({
      operation: Operation.Mean,
      from: from.toISOString(),
      to: new Date().toISOString(),
      aggregateMinutes: 1440,
      body: {
        bucket: this.bucket,
        sensors,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      } as ReadRequestBody
    }).subscribe(items => {
      if (items?.data) {
        const storage = this.createStorage(items, sparklines, this.sparklineMapping);
        this.updatePreviousValue(storage);
        const parsedStorage = Object.entries(storage).map(([id, data]) => Object.entries(data).map(([measurement, series]) => ({id, measurement, series})));
        const sparklineData = {} as any;
        for (const sensor of parsedStorage) {
          for (const measurement of sensor) {
            const value = {name: this.getDeviceName(measurement.measurement, measurement.id), series: measurement.series};

            if (sparklineData[measurement.measurement])
              sparklineData[measurement.measurement].push(value);
            else
              sparklineData[measurement.measurement] = [value];
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

    console.log(this.lineState);
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
    from.setDate(from.getDate() - 30);
    this.apiService.aggregate({
      operation: Operation.Mean,
      from: from.toISOString(),
      to: new Date().toISOString(),
      aggregateMinutes: 1440,
      body: {
        bucket: this.bucket,
        sensors: {[this.device?.deviceUid as string]: boxPlotFieldNames},
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      } as ReadRequestBody
    }).subscribe(items => {
      const storage = this.createStorage(items, boxPlotFieldNames, this.sparklineMapping);
      const boxSeries = Object.entries(storage[this.device?.deviceUid as string]).reduce((previous, [name, series]) => {
        const items = StatisticDeviceDetailDashboard.toBoxData(series as any[]);

        if (items)
          previous.push([{data: [{x: name, y: items}]}]);

        return previous;
      }, [] as any[]);
      this.boxData.push(...boxSeries);
    })
  }

  private static toBoxData(series: any[]) {
    const sortedSeries = series.map(item => item.value).sort();
    const q1 = +(d3.quantile(sortedSeries, .25) as number).toFixed(2);
    const median = +(d3.quantile(sortedSeries, .5) as number).toFixed(2);
    const q3 = +(d3.quantile(sortedSeries, .75) as number).toFixed(2);
    const interQuantileRange = q3 - q1;
    const min = q1 - 1.5 * interQuantileRange;
    const max = q1 + 1.5 * interQuantileRange;

    const data = [min.toFixed(2), q1, median, q3, max.toFixed(2)];

    return (max - min) < 0.5 ? undefined : data;
  }

  private extractDataFromInputs() {
    this.devices = this.devices?.filter(device => device !== this.device);
    this.devicesOptions.push(...this.devices?.map(device => ({name: device.deviceName, id: device.deviceUid})) as any[]);
    const from = new Date();
    from.setDate(from.getDate() - 7);


    const otherData = this.device.parameterValues?.filter(value => typeof value.number != "number" || value.visibility != 3) || [];

    this.otherData.push(...otherData.map(param => StatisticDeviceDetailDashboard.parseOtherParams(param)));
    this.kpis.push(...this.sparklines.map((field) => ({name: this.sparklineMapping(field), field: field})));
    console.log(this.kpis, this.fields);
    this.lineState.selectedKpis.push(...this.fields.map(field => ({name: this.sparklineMapping(field), field})));
    console.log(this.lineState);
    this.lineState.dates.push(from, new Date());
  }

  private createSensors(fields: string[]) {
    const sensorIds = this.lineState.selectedDevicesToCompareWith.map(item => item.id);
    const sensors = Object.fromEntries(sensorIds.map(deviceUid => [deviceUid as string, fields]));
    sensors[this.device?.deviceUid as string] = fields;
    return {fields, sensorIds, sensors}
  }

  private updateMainChart() {
    const {fields, sensorIds, sensors} = this.createSensors(this.lineState.selectedKpis.map(kpi => kpi.field));
    const from = this.lineState.dates[0].toISOString();
    const to = this.lineState.dates[this.lineState.dates.length - 1].toISOString();

    this.apiService.aggregate({
      operation: this.currentOperation as Operation,
      aggregateMinutes: 15,
      from,
      to,
      body: {bucket: this.bucket, sensors}
    }).subscribe(items => {
      if (items?.data) {
        const storage = this.createStorage(items, fields, this.sparklineMapping);
        this.results = this.handleMultipleLines(sensorIds, storage);
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

    return `${[...this.devicesOptions, this.device].find(device => device.deviceUid === id)?.deviceName || id}: ${measurement}`
  }

  private static parseOtherParams(param: ParameterValue) {
    let field = StatisticDeviceDetailDashboard.getFieldByType(param);

    if (param.type.name.toLowerCase().includes("date") && typeof field === "number") {
      field = new Date(field * 1000).toLocaleString();
    }

    return [field, param.type.label.split(/([A-Z][a-z]+)/).map((item: string) => item.trim()).filter((element: any) => element).join(' ')];
  }

  private static getFieldByType(param: ParameterValue) {
    switch (param.type.type) {
      case "string":
        return param.string;
      case "number":
        return param.number;
    }
    return "";
  }

  private createStorage(items: InfluxQueryResult, fields: string[], mapping: (name: string) => string): {[sensor: string]: {[field: string]: any[]}} {
    const storage = Object.fromEntries(
      [...this.lineState.selectedDevicesToCompareWith.map((device: { id: any; }) => device.id), this.device?.deviceUid].map(key =>
        [key, Object.fromEntries(fields.map(field => [mapping(field), []]))]
      )
    );

    items.data.forEach((item: { [x: string]: any; sensor: string | number; time: string | number | Date; }) => {
      fields.forEach(field => {
        this.getMinMax(field, mapping);
        storage[item.sensor][mapping(field)].push({value: Number(item[field]).toFixed(2), name: new Date(item.time)});
      })
    });
    return storage;
  }

  private getMinMax(field: string, mapping: (name: string) => string) {
    const parameter = this.device?.parameterValues?.find(parameter => parameter?.type?.name === field);
    // sort the thresholds
    const thresholds = [parameter?.type?.threshold1 || 0, parameter?.type?.threshold2 || 0].sort();

    const series = thresholds[0] === thresholds[1] ?
      [{value: thresholds[0], name: "Threshold"}] : // Same thresholds clip label and don't look too good
      [{value: thresholds[0], name: "Minimum"}, {value: thresholds[1], name: "Maximum"}];

    return this.sparklineMaxMin[mapping(field)] = series;
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
