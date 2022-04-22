import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {first, tap} from "rxjs/operators";
import {MessageService} from "primeng/api";
import {Device} from "../../generated/models/device";
import {environment} from "../../../environments/environment";
import {Bullet} from "../../library/dashboards/model/dashboards.model";
import {DeviceService} from "../../generated/services/device.service";
import {
  Availability
} from "../../library/components/availability/components/availability-component/availability.component";
import {InfluxService} from "../../generated/services/influx.service";
import {Operation} from "../../generated/models/operation";
import {BaseDashboardComponent} from "../base-dashboard/base-dashboard.component";

@Component({
  selector: 'app-device-availability-dashboard',
  templateUrl: './device-availability-dashboard.component.html',
  styleUrls: ['./device-availability-dashboard.component.css'],
  providers: [MessageService]
})
export class DeviceAvailabilityDashboardComponent extends BaseDashboardComponent implements OnInit {
  bucket = environment.bucket;
  devices: Device[] = [];
  bullets: Bullet[] = [];
  availabilities?: Availability[];

  async ngOnInit() {
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
      const all = this.fields;
      this.sparklines = this.fields.slice(0, 4);
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

      const monthBack = new Date();
      monthBack.setDate(monthBack.getDate() -30);

      if (all) {
        this.influxService.aggregate({
          operation: Operation.Count,
          from: monthBack.toISOString(),
          to: (new Date()).toISOString(),
          aggregateMinutes: 1440,
          body: {
            bucket: environment.bucket,
            sensors: {[this.deviceUid]: all},
          }
        }).subscribe(stats => {
            const data = stats.data.reduce(
              (previous, item) => {
                all.forEach(field => previous[field] += item[field] as number);
                return previous;
              }, Object.fromEntries(all.map(item => [item, 0]))
            );

            this.availabilities = Object.entries(data).map(([name, value]) => ({
              text: this.mapping ? this.mapping(name) : name,
              value: Math.round(value / (4 * 30 * 1440) * 10000) / 100
            })) as Availability[];
          }
        );
      }
    });
  }
}
