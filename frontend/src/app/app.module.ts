import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import {
  AvailabilityModule
} from "./library/components/availability/availability.module";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from "./app-routing.module";
import {DashboardsModule} from "./library/dashboards/components/dashboards.module";
import {HttpClientModule} from "@angular/common/http";
import { DeviceDetailDashboardComponent } from './components/device-detail-dashboard/device-detail-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DeviceDetailDashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AvailabilityModule,
    AppRoutingModule,
    DashboardsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
