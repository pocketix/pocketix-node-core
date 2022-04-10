import { Component, OnInit } from '@angular/core';
import {DeviceService} from "../../generated/services/device.service";
import {Device} from "../../generated/models/device";
import {Router} from "@angular/router";
import {deviceDetailPath} from "../../app-routing.module";

@Component({
  selector: 'app-devices-overview',
  templateUrl: './devices-overview.component.html',
  styleUrls: ['./devices-overview.component.css']
})
export class DevicesOverviewComponent implements OnInit {

  constructor(private deviceService: DeviceService, private router: Router) { }

  devices?: Device[];

  ngOnInit(): void {
    this.deviceService.getAllDevices().subscribe(devices => this.devices = devices);
  }

  statisticDetail(device: Device, deviceType: string) {
    this.router.navigate([`/${deviceDetailPath}`, deviceType], {
      queryParams: {deviceUid: device.deviceUid},
    })
  }
}
