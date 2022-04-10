import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {Bullet} from "./library/dashboards/components/dashboard-l5/statistic-device-detail-dashboard.component";
import {DeviceService} from "./generated/services/device.service";
import {Device} from "./generated/models/device";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private deviceService: DeviceService) {

  }

  ngOnInit() {
    this.deviceService.getAllDevices({}).subscribe(
      devices => {
        this.devices = devices;
      }
    );
    this.deviceService.getDeviceById({
      deviceUid: "boiler"
    }).subscribe(device => {
        this.device = device;
        this.fields = this.device.parameterValues?.map(parameterValues => parameterValues.type.name) || [];
        this.sparklines = this.fields;
        this.bullets = this.device.parameterValues?.map(parameterValue => ({
          value: parameterValue.number ?? 0,
          min: parameterValue.type.min ?? 0,
          max: parameterValue.type.max ?? 0,
          previousValue: parameterValue.number ?? 0,
          thresholds: [parameterValue.type.threshold1 ?? 0, parameterValue.type.threshold2 ?? 0].sort(),
          units: parameterValue.type.units ?? "",
          name: parameterValue.type.label ?? ""
        })) || [];
    });
  }
  device?: Device;
  title = 'dip';
  bucket = environment.bucket;
  devices: Device[] = [];
  fields?: string[];
  sparklines?: string[];
  bullets: Bullet[] = [];
}
