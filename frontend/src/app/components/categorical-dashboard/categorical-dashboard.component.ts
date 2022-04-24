import {Component, OnInit} from '@angular/core';
import {first, tap} from "rxjs/operators";
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
  parameterValueToBullet
} from "../../library/dashboards/shared/tranformFunctions";
import {KPIOptions} from "../../library/components/categorical/model/categorical.model";

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

  constructor(private route: ActivatedRoute, private deviceService: DeviceService, private influxService: InfluxService) { }

  async ngOnInit(): Promise<void> {
    await this.route.params.pipe(tap(
        parameters => this.type = parameters["type"] ?? ""
      ), first()
    ).toPromise();

    await this.route.queryParamMap.pipe(tap(
        query => this.deviceUid = query.get("deviceUid") ?? ""
      ), first()
    ).toPromise();
    this.deviceService.getDeviceById({
      deviceUid: this.deviceUid
    }).subscribe(device => {
      this.device = device;
      this.fields = this.device.parameterValues?.map(parameterValues => parameterValues.type.name) || [];
      this.KPIs.all = this.device.parameterValues?.map(parameterValues => parameterValues.type) || [];
      this.KPIs.default = this.KPIs.all.slice(0,3);

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

    this.influxService.filterDistinctValue({
      isString: false,
      shouldCount: false,
      body: {
        data: {
          bucket: environment.bucket,
          operation: Operation._,
          param: {
            to: to.toISOString(), from: startDay.toISOString(), sensors: {boiler: this.switchFields}
          }
        },
        values: this.states
      },
    }).subscribe(data => {
      console.log(data);
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
            key: field,
            value: typeof item === "number" ? Math.round(item * 100) / 100 + " °C": item
          })
        ));
        this.keyValue = keyValue;
      }
    );
  }
}
