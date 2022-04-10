import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeviceDetailDashboardComponent} from "./components/device-detail-dashboard/device-detail-dashboard.component";
import {DevicesOverviewComponent} from "./components/devices-overview/devices-overview.component";

export const deviceDetailPath = "details";

const routes: Routes = [
  {path: `${deviceDetailPath}/:type`, component: DeviceDetailDashboardComponent, pathMatch: "full"},
  {path: "", component: DevicesOverviewComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
