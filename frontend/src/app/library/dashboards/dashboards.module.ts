import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastModule} from "primeng/toast";
import {InputSwitchModule} from "primeng/inputswitch";
import {NgApexchartsModule} from "ng-apexcharts";
import {TooltipModule} from "primeng/tooltip";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {StatisticDeviceDetailDashboard} from "./components/dashboard-statistic/statistic-device-detail-dashboard.component";
import {DashboardAvailabilityComponent} from "./components/dashboard-availability/dashboard-availability.component";
import {LineModule} from "../components/line/line.module";
import {SparklineModule} from "../components/sparkline/sparkline.module";
import {BulletChartModule} from "../components/bullet-chart/bullet-chart.module";
import {AvailabilityModule} from "../components/availability/availability.module";
import {BaseDashboardComponent} from './components/base-dashboard/base-dashboard.component';
import {MainChartTemplateModule} from "../components/main-chart-template/components/main-chart-template.module";
import {DashboardCategoricalComponent} from "./components/dashboard-categorical/dashboard-categorical.component";
import {CategoricalModule} from "../components/categorical/categorical.module";
import {KeyValueDisplayModule} from "../components/key-value-display/key-value-display.module";
import {SwitchDisplayModule} from "../components/switch-display/switch-display.module";
import { ContainsFieldNamePipe } from './pipes/contains-fieldname.pipe';


@NgModule({
  declarations: [
    StatisticDeviceDetailDashboard,
    DashboardAvailabilityComponent,
    BaseDashboardComponent,
    DashboardCategoricalComponent,
    ContainsFieldNamePipe
  ],
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
    AvailabilityModule,
    MainChartTemplateModule,
    CategoricalModule,
    KeyValueDisplayModule,
    SwitchDisplayModule
  ],
  exports: [
    StatisticDeviceDetailDashboard,
    DashboardAvailabilityComponent,
    DashboardCategoricalComponent
  ]
})
export class DashboardsModule {
}
