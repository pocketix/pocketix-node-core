import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {
  AvailabilityModule
} from "./library/components/availability/availability.module";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {DeviceDetailDashboardComponent} from './components/device-detail-dashboard/device-detail-dashboard.component';
import {DevicesOverviewComponent} from './components/devices-overview/devices-overview.component';
import {PanelModule} from "primeng/panel";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {StyleClassModule} from "primeng/styleclass";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {
  DeviceAvailabilityDashboardComponent
} from './components/device-availability-dashboard/device-availability-dashboard.component';
import {DashboardsModule} from "./library/dashboards/dashboards.module";
import {CategoricalDashboardComponent} from './components/categorical-dashboard/categorical-dashboard.component';
import {CategoricalModule} from "./library/components/categorical/categorical.module";
import {KeyValueDisplayModule} from "./library/components/key-value-display/key-value-display.module";
import {BaseDashboardComponent} from './components/base-dashboard/base-dashboard.component';
import {ToastModule} from "primeng/toast";
import {ApiModule} from "./generated/api.module";
import {environment} from "../environments/environment";
import { RouterTestingModule } from "@angular/router/testing";


@NgModule({
  declarations: [
    AppComponent,
    DeviceDetailDashboardComponent,
    DevicesOverviewComponent,
    DeviceAvailabilityDashboardComponent,
    CategoricalDashboardComponent,
    BaseDashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot([]),
    AvailabilityModule,
    AppRoutingModule,
    DashboardsModule,
    HttpClientModule,
    PanelModule,
    CardModule,
    ButtonModule,
    DividerModule,
    StyleClassModule,
    ScrollPanelModule,
    CategoricalModule,
    KeyValueDisplayModule,
    ToastModule,
    RouterTestingModule,
    ApiModule.forRoot({rootUrl: environment.api})
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
