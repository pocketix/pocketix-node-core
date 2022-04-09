import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StatisticDeviceDetailDashboard} from "./dashboard-l5/statistic-device-detail-dashboard.component";
import {ToastModule} from "primeng/toast";
import {InputSwitchModule} from "primeng/inputswitch";
import {LineModule} from "../../components/line/line.module";
import {SparklineModule} from "../../components/sparkline/sparkline.module";
import {BulletChartModule} from "../../components/bullet-chart/bullet-chart.module";
import {NgApexchartsModule} from "ng-apexcharts";
import {TooltipModule} from "primeng/tooltip";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ApiModule} from "../../../generated/api.module";



@NgModule({
  declarations: [StatisticDeviceDetailDashboard],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    ToastModule,
    InputSwitchModule,
    LineModule,
    SparklineModule,
    BulletChartModule,
    NgApexchartsModule,
    TooltipModule,
    ApiModule.forRoot({rootUrl: "http://localhost:3000"})
  ],
  exports: [
    StatisticDeviceDetailDashboard
  ]
})
export class DashboardsModule { }
