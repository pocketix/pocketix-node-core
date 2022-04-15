import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash';
import {toNumber} from 'lodash';
import {InfluxService} from "../../../../../generated/services/influx.service";
import {Operation} from "../../../../../generated/models/operation";
import {OutputData} from "../../../../../generated/models/output-data";
import {environment} from "../../../../../../environments/environment";
import { InfluxQueryResult, ParameterType} from 'app/generated/models';
import {Color, LegendPosition} from "@swimlane/ngx-charts";

@Component({
  selector: 'categorical',
  templateUrl: './categorical.component.html',
  styleUrls: ['./categorical.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Categorical implements OnChanges {

  constructor(private influxService: InfluxService) {
  }

  @Input() deviceUid!: string;
  @Input() optionsKPI: ParameterType[] = [];
  @Input() defaultKPIs?: ParameterType[];

  currentDayData = [] as any[];
  currentDayDate = new Date();
  currentDayFields: ParameterType[] = [];
  pastDaysSwitchData = [] as any[];
  pastDaysSwitchDataWeekStart: Date = new Date();
  pastDaysSwitchDataWeekEnd: Date = new Date();
  pastDaysSwitchDataTicks = [] as any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  labelHours = 'Hours';
  labelDays = 'Days';
  showYAxisLabel = true;
  labelSwitchCount = 'Switch count';
  animations = true;
  True = true;

  aggregationOperations = Object.values(Operation).filter(item => isNaN(Number(item)));
  currentOperation = Operation.Sum.toString();

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  } as Color;

  hourTicks: string[] = _.range(0, 24, 2).map(item => item.toString());

  currentDaySwitchComposition = [] as any[];
  pastDaysSwitchDataLoading: boolean = false;
  currentDayDataLoading: boolean = false;

  private static fromEntries(iterable: Iterable<any>) {
    return Array.from(iterable).reduce((target, [key, value]) => {
      target[key] = value;
      return target;
    }, {});
  }

  sort = (first: { name: any; }, second: { name: any; }) => toNumber(first.name) > toNumber(second.name) ? 1 : -1;
  sortDates = (first: { name: string | number | Date; }, second: { name: string | number | Date; }) => new Date(first.name) > new Date(second.name) ? 1 : -1;
  position = LegendPosition.Below;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.defaultKPIs && !this.currentDayFields?.length)
      this.currentDayFields = this.defaultKPIs || [];

    this.pastDaysSwitchDataWeekStart.setDate(this.pastDaysSwitchDataWeekEnd.getDate() - 7);
    this.updateDay();
  }

  private loadDataForBarCharts(): void {
    this.currentDayDataLoading = true;
    const startOfDay = new Date(this.currentDayDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(this.currentDayDate.setHours(23, 59, 59, 999));

    this.influxService.aggregate({
      operation: this.currentOperation as Operation,
      from: startOfDay.toISOString(),
      to: endOfDay.toISOString(),
      aggregateMinutes: 60 * 2,
      body: {
        bucket: environment.bucket,
        sensors: {[this.deviceUid]: this.currentDayFields.map(kpi => kpi.name)}
      }
    }).subscribe(items => {
      this.currentDayData = this.itemsToBarChart(items, (time) => (new Date(time)).getHours().toString());
    });

    this.influxService.aggregate({
      operation: this.currentOperation as Operation,
      from: startOfDay.toISOString(),
      to: endOfDay.toISOString(),
      aggregateMinutes: 60 * 24, // 60 minutes in an hour
      body: {
        bucket: environment.bucket,
        sensors: {[this.deviceUid]: this.currentDayFields.map(kpi => kpi.name)}
      }
    }).subscribe(items => {
      this.currentDaySwitchComposition = [{
        name: 'Today',
        series: Object.entries(this.sumGroups(items)).map(([name, value]) => ({name, value}))
      }];
      this.currentDayDataLoading = false;
    });
  }

  private kpiParamToKpi(name: string) {
    const parameter = this.optionsKPI.find((current: ParameterType) => current.name === name);
    return parameter ? parameter.label : name;
  }

  private itemsToBarChart(items: any, dateTransformer: (value: string) => {}) {
    const createNgxNameValuePair = (item: OutputData, group: string) => {
      return {name: this.kpiParamToKpi(group), value: item[group] ? item[group] : 0};
    };

    const data = items?.data as OutputData[];
    return data.map(item => ({
      name: dateTransformer(item.time),
      series: this.currentDayFields.map(parameter => createNgxNameValuePair(item, parameter.name))
    }));
  }

  private createDefaultValue() {
    const a = this.currentDayFields.map((parameter) => parameter.name);
    return a.reduce((previous, kpi) => {
      previous[kpi] = 0;
      return previous;
    }, {} as any);
  }

  private sumGroups(item: InfluxQueryResult) {
    const data = item.data.reduce((previousValue, currentValue) => {
        const values = Object.entries(currentValue).filter(([key, __]) =>
          this.currentDayFields.find((parameter) => parameter.name === key)
        )
          .reduce((innerPreviousValue, [key, innerCurrentValue]) => {
            innerPreviousValue[key] += _.toNumber(innerCurrentValue);
            return innerPreviousValue;
          }, this.createDefaultValue());

        Object.entries(values).forEach(([key, value]) => previousValue[key] += value);
        return previousValue;
      },
      this.createDefaultValue());

    return Categorical.fromEntries(Object.entries(data).map(([key, value]) => [this.kpiParamToKpi(key), value]));
  }

  private switchInDays() {
    this.pastDaysSwitchDataLoading = true;
    console.log(this.pastDaysSwitchDataWeekStart, this.pastDaysSwitchDataWeekEnd);

    this.influxService.aggregate({
      operation: Operation.Sum,
      from: this.pastDaysSwitchDataWeekStart.toISOString(),
      to: this.pastDaysSwitchDataWeekEnd.toISOString(),
      aggregateMinutes: 60 * 24,
      body: {
        bucket: environment.bucket,
        sensors: [this.deviceUid],
      }
    }).subscribe(items => {
      this.pastDaysSwitchData = this.itemsToBarChart(items, (time) => new Date(time).toDateString());
      this.createPastDaysSwitchDataTicks();
      this.pastDaysSwitchDataLoading = false;
    });
  }

  switchInDaysMove(direction: number) {
    const days = direction > 0 ? +7 : -7;
    this.pastDaysSwitchDataWeekEnd.setDate(this.pastDaysSwitchDataWeekEnd.getDate() + days);
    this.pastDaysSwitchDataWeekStart.setDate(this.pastDaysSwitchDataWeekStart.getDate() + days);
    this.switchInDays();
  }

  updateDay() {
    if (!this.currentDayFields?.length) {
      return;
    }

    this.loadDataForBarCharts();
    this.switchInDays();
  }

  private createPastDaysSwitchDataTicks() {
    const start = new Date(this.pastDaysSwitchDataWeekStart.setHours(0, 0, 0, 0));
    const dates = [];

    while (start < this.pastDaysSwitchDataWeekEnd) {
      dates.push(start.toDateString());
      start.setDate(start.getDate() + 1);
    }

    this.pastDaysSwitchDataTicks = dates;
  }
}
