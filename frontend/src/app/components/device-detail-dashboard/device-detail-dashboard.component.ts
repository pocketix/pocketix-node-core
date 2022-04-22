import { Component, OnInit } from '@angular/core';
import {BaseDashboardComponent} from "../base-dashboard/base-dashboard.component";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-device-detail-dashboard',
  templateUrl: './device-detail-dashboard.component.html',
  styleUrls: ['./device-detail-dashboard.component.css'],
  providers: [MessageService]
})
export class DeviceDetailDashboardComponent extends BaseDashboardComponent {

}
