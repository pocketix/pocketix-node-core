import { Component, OnInit } from '@angular/core';
import {PathParameterAccessor} from "../../utility/PathParameterAccessor";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-device-availability-dashboard',
  templateUrl: './device-availability-dashboard.component.html',
  styleUrls: ['./device-availability-dashboard.component.css']
})
export class DeviceAvailabilityDashboardComponent implements OnInit {
  private type = "";
  private deviceUid = "";

  constructor(private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.type = await PathParameterAccessor.getPathParameter(this.route, "type") ?? "";
    this.deviceUid = await PathParameterAccessor.getQueryParameter(this.route, "deviceUid") ?? "";
  }

}
