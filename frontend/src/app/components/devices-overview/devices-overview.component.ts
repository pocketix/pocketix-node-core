import {Component, OnInit} from '@angular/core';
import {DeviceService} from "../../generated/services/device.service";
import {Device} from "../../generated/models/device";
import {Router} from "@angular/router";
import {deviceAvailabilityPath, deviceCategoricalPath, deviceDetailPath} from "../../app-routing.module";
import {MessageService} from "primeng/api";
import {originalOrder} from "../../library/dashboards/shared/utility";

@Component({
  selector: 'app-devices-overview',
  templateUrl: './devices-overview.component.html',
  styleUrls: ['./devices-overview.component.css'],
  providers: [MessageService]
})
export class DevicesOverviewComponent implements OnInit {
  originalOrder = originalOrder;

  constructor(private deviceService: DeviceService, private router: Router, private messageService: MessageService) { }

  devicesByType?: {[type: string]: Device[]}

  ngOnInit(): void {
    this.deviceService.getAllDevices().subscribe(devices => {
      console.log(devices);
      this.devicesByType = devices.reduce((previousValue, device) => {
        if (!previousValue[device.type.name])
          previousValue[device.type.name] = []

        previousValue[device.type.name].push(device);
        return previousValue;
      }, {} as any);
      console.log(this.devicesByType);
    },
      () => this.messageService.add({
        severity: "error",
        summary: "Could not retrieve data",
        detail: "Data could not be updated"
      }));
  }

  statisticDetail(device: Device, deviceType: string) {
    this.router.navigate([`/${deviceDetailPath}`, deviceType], {
      queryParams: {deviceUid: device.deviceUid},
    })
  }

  availabilityDetail(device: Device, deviceType: string) {
    this.router.navigate([`/${deviceAvailabilityPath}`, deviceType], {
      queryParams: {deviceUid: device.deviceUid},
    })
  }

  categoricalDetail(device: Device, deviceType: string) {
    this.router.navigate([`/${deviceCategoricalPath}`, deviceType], {
      queryParams: {deviceUid: device.deviceUid},
    })
  }
}
