import { Component } from '@angular/core';
import {environment} from "../environments/environment";
import {Bullet, Device} from "./library/dashboards/components/dashboard-l5/statistic-device-detail-dashboard.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dip';
  bucket = environment.bucket;
  devices: Device[] = [{
    deviceName: "boiler",
    deviceUid: "boiler",
    parameterValues: [{
      visibility: 3,
      number: 10,
      parameterType: {
        name: "temperature",
        label: "temperature",
        treshold1: 0,
        treshold2: 2,
        type: "number"
      }
    }]
  }];
  fields = ["boiler_temperature", "dhw_temperature"];
  sparklines = ["boiler_temperature", "dhw_temperature"];
  bullets: Bullet[] = [{
    value: 50,
    min: 10,
    max:40,
    previousValue: 20,
    thresholds: [15],
    units: "abcd",
    name: "boiler"
  }];
}
