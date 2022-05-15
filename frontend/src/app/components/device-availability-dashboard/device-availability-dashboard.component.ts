import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {Device} from "../../generated/models/device";
import {environment} from "../../../environments/environment";
import {Bullet, SparklineState} from "../../library/dashboards/model/dashboards.model";
import {Operation} from "../../generated/models/operation";
import {BaseDashboardComponent} from "../base-dashboard/base-dashboard.component";
import {
  createStorage,
  parameterValueToBullet, storageToSparklines,
  twoDatesAndPointCountToAggregationMinutes,
} from "../../library/dashboards/shared/tranformFunctions";
import {Availability} from "../../library/components/availability/model/availability.model";

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
  sensorAvailabilities?: Availability[];
  sensorSparklineLastYear?: SparklineState;

  async ngOnInit() {
    await super.ngOnInit();

    this.deviceService.getDevicesByDeviceType({
      deviceType: this.type
    }).subscribe(
      devices => this.devices = devices
    );

    this.deviceService.getDeviceById({
      deviceUid: this.deviceUid
    }).subscribe(async device => {
      this.device = device;
      this.fields = this.device.parameterValues?.map(parameterValues => parameterValues.type.name) || [];
      const all = this.fields;
      this.sparklines = this.fields.slice(0, 4);
      this.fields = this.fields.slice(0, 3);
      this.bullets = this.device.parameterValues?.map(parameterValueToBullet) || [];
      this.mapping = (field) =>
        this.device?.parameterValues?.find(value => value.type.name === field)?.type.label ?? field;

      const monthBack = new Date();
      monthBack.setDate(monthBack.getDate() - 30);

      if (all) {
        this.availabilities = await this.getAvailability(monthBack, all);
      }
    });
  }

  private async getAvailability(from: Date, fields: string[], minutes = 1440) {
    const stats = await this.influxService.aggregate({
      operation: Operation.Count,
      from: from.toISOString(),
      to: (new Date()).toISOString(),
      aggregateMinutes: minutes,
      body: {
        bucket: environment.bucket,
        sensors: {[this.deviceUid]: fields},
      }
    }).toPromise()
    const data = stats.data.reduce(
      (previous, item) => {
        fields.forEach(field => previous[field] += item[field] as number);
        return previous;
      }, Object.fromEntries(fields.map(item => [item, 0]))
    );

    return this.numericalDataToAvailability(data);
  }

  private numericalDataToAvailability(data: { [p: string]: number }, availabilityOverrides?: { [p: string]: number }) {
    const days = 30;
    const minutesPerDay = 1440;
    return Object.entries(data).map(([name, value]) => ({
      text: this.mapping ? this.mapping(name) : name,
      field: name,
      value: this.getAvailabilityValue(value, name, availabilityOverrides ? availabilityOverrides[name] : days, minutesPerDay)
    })) as Availability[];
  }

  private getAvailabilityValue(value: number, name: string, days: number, minutesPerDay: number) {
    const measurementsPerMinute = this.device.parameterValues?.find(item =>
      item.type.name === name
    )?.type?.measurementsPerMinute ?? 1;
    return Math.round(value / (measurementsPerMinute * days * minutesPerDay) * 10000) / 100;
  }

  async updateAvailabilityData($event: Availability) {
    const to = new Date(this.to);
    const startDay = new Date(this.to);
    startDay.setHours(0, 0, 0,0);
    const sevenDaysBack = new Date()
    const thirtyDaysBack = new Date();
    sevenDaysBack.setDate(startDay.getDate() - 7);
    thirtyDaysBack.setDate(startDay.getDate() - 30);
    const yearBack = new Date();
    yearBack.setDate(startDay.getDate() - 365);

    const yearBackData = await this.influxService.aggregate({
      operation: Operation.Mean,
      aggregateMinutes: twoDatesAndPointCountToAggregationMinutes(yearBack, to, 300),
      body: {
        bucket: environment.bucket,
        sensors: {[this.deviceUid]: [$event.field as string]}
      }
    }).toPromise();

    const {storage, thresholdLines} = createStorage(this.lineState, yearBackData, [$event.field as string], this.mapping);
    const sparklineData = storageToSparklines(this.lineState, storage);

    this.sensorSparklineLastYear = {
      minMax: thresholdLines,
      device: this.device,
      data: Object.values(sparklineData)
    };

    const data = await this.influxService.parameterAggregationWithMultipleStarts({
      body: {
        starts: [thirtyDaysBack.toISOString(), sevenDaysBack.toISOString(), startDay.toISOString()],
        data: {
          bucket: environment.bucket,
          operation: Operation.Count,
          param: {
            from: thirtyDaysBack.toISOString(),
            to: to.toISOString(),
            sensors: {[this.deviceUid]: [$event.field as string]}
          }
        }
      }
    }).toPromise();

    const transformedData = {
      "Thirty days back": data.data[0][$event.field as string] as number,
      "Seven days back": data.data[1][$event.field as string] as number,
      "Today": data.data[2][$event.field as string] as number
    };

    const availabilityOverrides = {
      "Thirty days back": (to.getTime() - thirtyDaysBack.getTime()) / (1000 * 3600 * 24),
      "Seven days back": (to.getTime() - sevenDaysBack.getTime()) / (1000 * 3600 * 24),
      "Today": (to.getTime() - startDay.getTime()) / (1000 * 3600 * 24),
    };

    this.sensorAvailabilities = this.numericalDataToAvailability(transformedData, availabilityOverrides);
  }
}
