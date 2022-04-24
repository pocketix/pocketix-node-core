import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash';
import {toNumber} from 'lodash';
import {InfluxService} from "../../../../../generated/services/influx.service";
import {Operation} from "../../../../../generated/models/operation";
import {environment} from "../../../../../../environments/environment";
import {ParameterType} from 'app/generated/models';
import {Color, LegendPosition} from "@swimlane/ngx-charts";
import {Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {CurrentDayState, KPIOptions, PastDaysState} from "../../model/categorical.model";
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
  @Input() KPIs!: KPIOptions;

  @Input()
  set currentDay(currentDay: CurrentDayState) {
    this._currentDay = currentDay
  }
  @Output()
  currentDayChanges: EventEmitter<CurrentDayState> = new EventEmitter<CurrentDayState>();
  @Output()
  currentDayChanged: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  set pastDays(pastDays: PastDaysState) {
    this._pastDays = pastDays;
  }
  @Output()
  pastDaysChanges: EventEmitter<PastDaysState> = new EventEmitter<PastDaysState>();
  @Output()
  pastDaysMove: EventEmitter<number> = new EventEmitter<number>();

  _currentDay = {
    data: [] as Series[],
    date: new Date(),
    fields: [] as ParameterType[],
    switchComposition: [] as Series[],
    dataLoading: false
  } as CurrentDayState;

  _pastDays = {
    data: [] as Series[],
    startDate: new Date(),
    endDate: new Date(),
    ticks: [] as string[],
    dataLoading: false
  } as PastDaysState;

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
    if (changes?.KPIs && !this._currentDay.fields?.length)
      this._currentDay.fields = this.KPIs.default || [];

    this._pastDays.startDate.setDate(this._pastDays.endDate.getDate() - 7);
    this.updateDay({});
  }

  private loadDataForBarCharts(): void {
    this._currentDay.dataLoading = true;
    const startOfDay = new Date(this._currentDay.date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(this._currentDay.date.setHours(23, 59, 59, 999));

    this.influxService.aggregate({
      operation: this.currentOperation as Operation,
      from: startOfDay.toISOString(),
      to: endOfDay.toISOString(),
      aggregateMinutes: 60 * 2,
      body: {
        bucket: environment.bucket,
        sensors: {[this.deviceUid]: this._currentDay.fields.map(kpi => kpi.name)}
      }
    }).subscribe(items => {
      this._currentDay.data = itemsToBarChart(items, this.KPIs.all, this._currentDay.fields, (time) => (new Date(time)).getHours().toString());
    });

    this.influxService.aggregate({
      operation: this.currentOperation as Operation,
      from: startOfDay.toISOString(),
      to: endOfDay.toISOString(),
      aggregateMinutes: 60 * 24, // 60 minutes in an hour
      body: {
        bucket: environment.bucket,
        sensors: {[this.deviceUid]: this._currentDay.fields.map(kpi => kpi.name)}
      }
    }).subscribe(items => {
      this._currentDay.switchComposition = [{
        name: 'Today',
        series: Object.entries(sumGroups(items, this._currentDay, this.KPIs.all)).map(([name, value]) => ({name, value}))
      }];
      this._currentDay.dataLoading = false;
    });
  }

  private switchInDays() {
    this._pastDays.dataLoading = true;

    this.influxService.aggregate({
      operation: Operation.Sum,
      from: this._pastDays.startDate.toISOString(),
      to: this._pastDays.endDate.toISOString(),
      aggregateMinutes: 60 * 24,
      body: {
        bucket: environment.bucket,
        sensors: [this.deviceUid],
      }
    }).subscribe(items => {
      this._pastDays.data = itemsToBarChart(items,
        this.KPIs.all,
        this._currentDay.fields,
        (time) => new Date(time).toDateString());
      createPastDaysSwitchDataTicks(this._pastDays);
      this._pastDays.dataLoading = false;
    });
  }

  switchInDaysMove(direction: number) {
    const days = direction > 0 ? +7 : -7;
    this._pastDays.endDate.setDate(this._pastDays.endDate.getDate() + days);
    this._pastDays.startDate.setDate(this._pastDays.startDate.getDate() + days);
    this.pastDaysMove.emit(direction);
    this.switchInDays();
  }

  updateDay($event: any) {
    this.currentDayChanged.emit($event);
    if (!this._currentDay.fields?.length) {
      return;
    }

    this.loadDataForBarCharts();
    this.switchInDays();
  }
}
