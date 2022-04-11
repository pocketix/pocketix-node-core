import { Component, OnInit } from '@angular/core';
import {DeviceService} from "../../generated/services/device.service";
import {Device} from "../../generated/models/device";
import {Router} from "@angular/router";
import {deviceAvailabilityPath, deviceDetailPath} from "../../app-routing.module";

@Component({
  selector: 'app-devices-overview',
  templateUrl: './devices-overview.component.html',
  styleUrls: ['./devices-overview.component.css']
})
export class DevicesOverviewComponent implements OnInit {

  constructor(private deviceService: DeviceService, private router: Router) { }

  devicesByType?: {[type: string]: Device[]}

  ngOnInit(): void {
    this.deviceService.getAllDevices().subscribe(devices => {
      this.devicesByType = devices.reduce((previousValue, device) => {
        if (!previousValue[device.type.name])
          previousValue[device.type.name] = []

        previousValue[device.type.name].push(device);
        return previousValue;
      }, {} as any)
    });
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
}
