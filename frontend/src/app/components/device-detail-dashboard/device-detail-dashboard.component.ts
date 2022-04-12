import { Component, OnInit } from '@angular/core';
import {DeviceService} from "../../generated/services/device.service";
import {Device} from "../../generated/models/device";
import {environment} from "../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {first, tap} from "rxjs/operators";
import {Bullet} from "../../library/dashboards/model/dashboards.model";

@Component({
  selector: 'app-device-detail-dashboard',
  templateUrl: './device-detail-dashboard.component.html',
  styleUrls: ['./device-detail-dashboard.component.css']
})
export class DeviceDetailDashboardComponent implements OnInit {
  mapping?: (string: string) => string
  device?: Device;
  title = 'dip';
  bucket = environment.bucket;
  devices: Device[] = [];
  fields?: string[];
  sparklines?: string[];
  bullets: Bullet[] = [];
  private deviceUid: string = "";
  private type: string = "";

  constructor(private deviceService: DeviceService, private route: ActivatedRoute) { }
  async ngOnInit() {
    await this.route.params.pipe(tap(
        parameters => this.type = parameters["type"] ?? ""
      ), first()
    ).toPromise();

    await this.route.queryParamMap.pipe(tap(
      query => this.deviceUid = query.get("deviceUid") ?? ""
      ), first()
    ).toPromise();

    this.deviceService.getDevicesByDeviceType({
      deviceType: this.type
    }).subscribe(
      devices => this.devices = devices
    );

    this.deviceService.getDeviceById({
      deviceUid: this.deviceUid
    }).subscribe(device => {
      this.device = device;
      this.fields = this.device.parameterValues?.map(parameterValues => parameterValues.type.name) || [];
      this.sparklines = this.fields;
      this.fields = this.fields.slice(0, 3);
      this.bullets = this.device.parameterValues?.map(parameterValue => ({
        value: parameterValue.number ?? 0,
        min: parameterValue.type.min ?? 0,
        max: parameterValue.type.max ?? 0,
        previousValue: parameterValue.number ?? 0,
        thresholds: [parameterValue.type.threshold1 ?? 0, parameterValue.type.threshold2 ?? 0].sort(),
        units: parameterValue.type.units ?? "",
        name: parameterValue.type.label ?? ""
      })) || [];
      this.mapping = (field) =>
        this.device?.parameterValues?.find(value => value.type.name === field)?.type.label ?? field;
    });
  }
}
