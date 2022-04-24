import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash';
import {toNumber} from 'lodash';
import {InfluxService} from "../../../../../generated/services/influx.service";
import {Operation} from "../../../../../generated/models/operation";
import {environment} from "../../../../../../environments/environment";
import {ParameterType} from 'app/generated/models';
import {Color, LegendPosition} from "@swimlane/ngx-charts";
import {Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {CurrentDayState, PastDaysState} from "../../model/categorical.model";
import {
  createPastDaysSwitchDataTicks,
  itemsToBarChart,
  sumGroups
} from "../../../../dashboards/shared/tranformFunctions";

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

  currentDay = {
    data: [] as Series[],
    date: new Date(),
    fields: [] as ParameterType[],
    switchComposition: [] as Series[],
    dataLoading: false
  } as CurrentDayState

  pastDays = {
    data: [] as Series[],
    startDate: new Date(),
    endDate: new Date(),
    ticks: [] as string[],
    dataLoading: false
  } as PastDaysState

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

  aggregationOperations = Object.values(Operation).filter(item => isNaN(Number(item)));
  currentOperation = Operation.Sum.toString();

  @Input()
  colorScheme: Color = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  } as Color;

  hourTicks: string[] = _.range(0, 24, 2).map(item => item.toString());

  sort = (first: { name: any; }, second: { name: any; }) => toNumber(first.name) > toNumber(second.name) ? 1 : -1;
  sortDates = (first: { name: string | number | Date; }, second: { name: string | number | Date; }) =>
    new Date(first.name) > new Date(second.name) ? 1 : -1;

  position = LegendPosition.Below;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.defaultKPIs && !this.currentDay.fields?.length)
      this.currentDay.fields = this.defaultKPIs || [];

    this.pastDays.startDate.setDate(this.pastDays.endDate.getDate() - 7);
    this.updateDay();
  }

  private loadDataForBarCharts(): void {
    this.currentDay.dataLoading = true;
    const startOfDay = new Date(this.currentDay.date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(this.currentDay.date.setHours(23, 59, 59, 999));

    this.influxService.aggregate({
      operation: this.currentOperation as Operation,
      from: startOfDay.toISOString(),
      to: endOfDay.toISOString(),
      aggregateMinutes: 60 * 2,
      body: {
        bucket: environment.bucket,
        sensors: {[this.deviceUid]: this.currentDay.fields.map(kpi => kpi.name)}
      }
    }).subscribe(items => {
      this.currentDay.data = itemsToBarChart(items, this.optionsKPI, this.currentDay.fields, (time) => (new Date(time)).getHours().toString());
    });

    this.influxService.aggregate({
      operation: this.currentOperation as Operation,
      from: startOfDay.toISOString(),
      to: endOfDay.toISOString(),
      aggregateMinutes: 60 * 24, // 60 minutes in an hour
      body: {
        bucket: environment.bucket,
        sensors: {[this.deviceUid]: this.currentDay.fields.map(kpi => kpi.name)}
      }
    }).subscribe(items => {
      this.currentDay.switchComposition = [{
        name: 'Today',
        series: Object.entries(sumGroups(items, this.currentDay, this.optionsKPI)).map(([name, value]) => ({name, value}))
      }];
      this.currentDay.dataLoading = false;
    });
  }

  private switchInDays() {
    this.pastDays.dataLoading = true;

    this.influxService.aggregate({
      operation: Operation.Sum,
      from: this.pastDays.startDate.toISOString(),
      to: this.pastDays.endDate.toISOString(),
      aggregateMinutes: 60 * 24,
      body: {
        bucket: environment.bucket,
        sensors: [this.deviceUid],
      }
    }).subscribe(items => {
      this.pastDays.data = itemsToBarChart(items,
        this.optionsKPI,
        this.currentDay.fields,
        (time) => new Date(time).toDateString());
      createPastDaysSwitchDataTicks(this.pastDays);
      this.pastDays.dataLoading = false;
    });
  }

  switchInDaysMove(direction: number) {
    const days = direction > 0 ? +7 : -7;
    this.pastDays.endDate.setDate(this.pastDays.endDate.getDate() + days);
    this.pastDays.startDate.setDate(this.pastDays.startDate.getDate() + days);
    this.switchInDays();
  }

  updateDay() {
    if (!this.currentDay.fields?.length) {
      return;
    }

    this.loadDataForBarCharts();
    this.switchInDays();
  }
}
