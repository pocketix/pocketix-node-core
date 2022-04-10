import { Component, OnInit } from '@angular/core';
import {DeviceService} from "../../generated/services/device.service";
import {Device} from "../../generated/models/device";
import {environment} from "../../../environments/environment";
import {Bullet} from "../../library/dashboards/components/dashboard-l5/statistic-device-detail-dashboard.component";
import {ActivatedRoute} from "@angular/router";
import {PathParameterAccessor} from "../../utility/PathParameterAccessor";

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
    this.type = await PathParameterAccessor.getPathParameter(this.route, "type") ?? "";
    this.deviceUid = await PathParameterAccessor.getQueryParameter(this.route, "deviceUid") ?? "";

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
