import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MessageService} from "primeng/api";
import {
  extractDataFromDeviceDefinition
} from "../../shared/tranformFunctions";
import {BaseDashboardComponent} from "../base-dashboard/base-dashboard.component";

@Component({
  selector: 'statistic-device-detail-dashboard',
  templateUrl: './statistic-device-detail-dashboard.component.html',
  styleUrls: ['./statistic-device-detail-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class StatisticDeviceDetailDashboard extends BaseDashboardComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.otherData.push(...extractDataFromDeviceDefinition(this.device));
  }
}
