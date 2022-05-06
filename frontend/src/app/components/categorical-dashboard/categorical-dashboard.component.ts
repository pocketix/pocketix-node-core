import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DeviceService} from "../../generated/services/device.service";
import {Device} from "../../generated/models/device";
import {OutputData} from "../../generated/models/output-data";
import {InfluxService} from "../../generated/services/influx.service";
import {SingleSimpleValue} from "../../generated/models/single-simple-value";
import {environment} from "../../../environments/environment";
import {Operation} from "../../generated/models/operation";
import { Bullet } from 'app/library/dashboards/model/dashboards.model';
import {
  createMappingFromParameterValues,
  createPastDaysSwitchDataTicks,
  itemsToBarChart,
  parameterValueToBullet,
  sumGroups
} from "../../library/dashboards/shared/tranformFunctions";
import {CurrentDayState, KPIOptions, PastDaysState} from "../../library/components/categorical/model/categorical.model";
import {Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {ParameterType} from "../../generated/models/parameter-type";

@Component({
  selector: 'app-categorical-dashboard',
  templateUrl: './categorical-dashboard.component.html',
  styleUrls: ['./categorical-dashboard.component.css']
})
export class CategoricalDashboardComponent implements OnInit {
  mapping!: (field: string) => string;
  type?: string;
  deviceUid!: string;
  device?: Device;
  fields?: string[]
  keyValue?: {key: string, value: string}[] = [];
  data?: OutputData[];
  states = [0, 1, 2] as SingleSimpleValue[];
  switchFields?: string[] = [];
  bullets?: Bullet[];
  start?: Date;
  KPIs: KPIOptions = {
    all: [],
    default: []
  };
  currentDay = {
    data: [] as Series[],
    date: new Date(),
    fields: [] as ParameterType[],
    switchComposition: [] as Series[],
    dataLoading: false,
    allAggregationOperations: Object.values(Operation).filter(item => isNaN(Number(item))),
    selectedAggregationOperation: Operation.Sum.toString()
  } as CurrentDayState;

  pastDays = {
    data: [] as Series[],
    startDate: new Date(),
    endDate: new Date(),
    ticks: [] as string[],
    dataLoading: false
  } as PastDaysState;

  constructor(private route: ActivatedRoute, private deviceService: DeviceService, private influxService: InfluxService) { }

  async ngOnInit(): Promise<void> {
    this.type = this.route.snapshot.params["type"] ?? "";
    this.deviceUid = this.route.snapshot.queryParams["deviceUid"];

    this.deviceService.getDeviceById({
      deviceUid: this.deviceUid
    }).subscribe(device => {
      this.device = device;
      this.fields = this.device.parameterValues?.map(parameterValues => parameterValues.type.name) || [];
      this.KPIs.all = this.device.parameterValues?.map(parameterValues => parameterValues.type) || [];
      this.KPIs.default = this.KPIs.all.slice(0,3);

      this.currentDay.fields = this.KPIs.default || [];
      this.switchInDays();
      this.loadDataForBarCharts();

      this.bullets = this.device.parameterValues?.map(parameterValueToBullet) || [];
      this.mapping = createMappingFromParameterValues(this?.device?.parameterValues || []);
    });

    const to = new Date();
    const startDay = new Date();
    startDay.setHours(0, 0, 0,0);
    const sevenDaysBack = new Date()
    const thirtyDaysBack = new Date();
    sevenDaysBack.setDate(startDay.getDate() - 7);
    thirtyDaysBack.setDate(startDay.getDate() - 30);


    const fields = ["boiler_temperature", "outside_temperature"];
    this.switchFields = ["boiler_status", "out_pomp1"];
    this.start = startDay;
    this.pastDays.startDate.setDate(this.pastDays.endDate.getDate() - 7);

    this.influxService.filterDistinctValue({
      isString: false,
      shouldCount: false,
      body: {
        data: {
          bucket: environment.bucket,
          operation: Operation._,
          param: {
            to: to.toISOString(), from: sevenDaysBack.toISOString(), sensors: {boiler: this.switchFields}
          }
        },
        values: this.states
      },
    }).subscribe(data => {
      this.data = data.data
    });

    this.influxService.parameterAggregationWithMultipleStarts({
      body: {
        starts: [startDay.toISOString(), sevenDaysBack.toISOString(), thirtyDaysBack.toISOString()],
        data: {
          bucket: environment.bucket,
          operation: Operation.Mean,
          param: { sensors: {boiler: fields} }
        }
      }
    }).subscribe(
      data => {
        const sortedData = data.data.sort((first, second) =>
          new Date(first.time) < new Date(second.time) ? -1 : 1)

        const storage = Object.fromEntries(fields.map(field => [field, [] as (number | string)[]]));
        const keyValue: { key: string; value: string; }[] = [];

        sortedData.forEach(item => fields.forEach(field => storage[field].push(item[field])));
        Object.entries(storage).forEach(([field, array]) => array.map(
          item => keyValue.push({
            key: this.mapping(field),
            value: typeof item === "number" ? Math.round(item * 100) / 100 + " °C": item
          })
        ));
        this.keyValue = keyValue;
      }
    );
  }

  private loadDataForBarCharts(): void {
    this.currentDay.dataLoading = true;
    const startOfDay = new Date(this.currentDay.date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(this.currentDay.date.setHours(23, 59, 59, 999));

    this.influxService.aggregate({
      operation: this.currentDay.selectedAggregationOperation as Operation,
      from: startOfDay.toISOString(),
      to: endOfDay.toISOString(),
      aggregateMinutes: 60 * 2,
      body: {
        bucket: environment.bucket,
        sensors: {[this.deviceUid]: this.currentDay.fields.map(kpi => kpi.name)},
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }).subscribe(items => {
      this.currentDay.data = itemsToBarChart(items, this.KPIs.all, this.currentDay.fields, (time) => {
        const hours = Math.ceil((new Date(time)).getHours() / 2) * 2;
        return hours.toString();
      });
    });

    this.influxService.aggregate({
      operation: this.currentDay.selectedAggregationOperation as Operation,
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
        series: Object.entries(sumGroups(items, this.currentDay, this.KPIs.all)).map(([name, value]) => ({name, value}))
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
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }).subscribe(items => {
      this.pastDays.data = itemsToBarChart(items,
        this.KPIs.all,
        this.currentDay.fields,
        (time) => new Date(time).toDateString());
      createPastDaysSwitchDataTicks(this.pastDays);
      this.pastDays.dataLoading = false;
    });
  }

  currentDayChanged(_: any) {
    if (!this.currentDay.fields?.length) {
      return;
    }
    this.loadDataForBarCharts();
    this.switchInDays();
  }

  pastDaysMove(direction: number) {
    const days = direction > 0 ? +7 : -7;
    this.pastDays.endDate.setDate(this.pastDays.endDate.getDate() + days);
    this.pastDays.startDate.setDate(this.pastDays.startDate.getDate() + days);
    this.switchInDays();
  }
}
