import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeviceDetailDashboardComponent} from "./components/device-detail-dashboard/device-detail-dashboard.component";
import {DevicesOverviewComponent} from "./components/devices-overview/devices-overview.component";
import {
  DeviceAvailabilityDashboardComponent
} from "./components/device-availability-dashboard/device-availability-dashboard.component";
import {CategoricalDashboardComponent} from "./components/categorical-dashboard/categorical-dashboard.component";

export const deviceDetailPath = "details";
export const deviceAvailabilityPath = "availability";
export const deviceCategoricalPath = "categorical"

const routes: Routes = [
  {path: `${deviceDetailPath}/:type`, component: DeviceDetailDashboardComponent, pathMatch: "full"},
  {path: `${deviceAvailabilityPath}/:type`, component: DeviceAvailabilityDashboardComponent, pathMatch: "full"},
  {path: `${deviceCategoricalPath}/:type`, component: CategoricalDashboardComponent, pathMatch: "full"},
  {path: "", component: DevicesOverviewComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
