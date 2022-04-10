import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import {
  AvailabilityModule
} from "./library/components/availability/availability.module";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import { DeviceDetailDashboardComponent } from './components/device-detail-dashboard/device-detail-dashboard.component';
import { DevicesOverviewComponent } from './components/devices-overview/devices-overview.component';
import {PanelModule} from "primeng/panel";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import { KeyValueDisplayComponent } from './library/components/key-value-display/key-value-display.component';
import {DividerModule} from "primeng/divider";
import {StyleClassModule} from "primeng/styleclass";
import {ScrollPanelModule} from "primeng/scrollpanel";
import { DeviceAvailabilityDashboardComponent } from './components/device-availability-dashboard/device-availability-dashboard.component';
import {DashboardsModule} from "./library/dashboards/dashboards.module";

@NgModule({
  declarations: [
    AppComponent,
    DeviceDetailDashboardComponent,
    DevicesOverviewComponent,
    KeyValueDisplayComponent,
    DeviceAvailabilityDashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AvailabilityModule,
    AppRoutingModule,
    DashboardsModule,
    HttpClientModule,
    PanelModule,
    CardModule,
    ButtonModule,
    DividerModule,
    StyleClassModule,
    ScrollPanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
