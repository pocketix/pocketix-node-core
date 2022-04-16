import {Component, OnInit} from '@angular/core';
import {first, tap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {DeviceService} from "../../generated/services/device.service";
import {Device} from "../../generated/models/device";
import {ParameterType} from "../../generated/models/parameter-type";
import {OutputData} from "../../generated/models/output-data";
import {InfluxService} from "../../generated/services/influx.service";
import {SingleSimpleValue} from "../../generated/models/single-simple-value";
import {environment} from "../../../environments/environment";
import {Operation} from "../../generated/models/operation";

@Component({
  selector: 'app-categorical-dashboard',
  templateUrl: './categorical-dashboard.component.html',
  styleUrls: ['./categorical-dashboard.component.css']
})
export class CategoricalDashboardComponent implements OnInit {
  type?: string;
  deviceUid!: string;
  device?: Device;
  fields?: string[]
  parameterTypes: ParameterType[] = [];
  defaults: ParameterType[] = [];
  keyValue?: {key: string, value: string}[] = [];
  data?: OutputData[];
  states = [0, 1, 2] as SingleSimpleValue[];

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
      this.parameterTypes = this.device.parameterValues?.map(parameterValues => parameterValues.type) || [];
      this.defaults = this.parameterTypes.slice(0,3);
    });

    const to = new Date();
    const from = new Date()
    from.setDate(from.getDate() - 7);

    this.influxService.filterDistinctValue({
      isString: false,
      shouldCount: false,
      body: {
        data: {
          bucket: environment.bucket,
          operation: Operation._,
          param: {
            to: to.toISOString(), from: from.toISOString(), sensors: {boiler: ["boiler_status"]}
          }
        },
        values: this.states
      },
    }).subscribe(data => this.data = data.data);
  }
}
