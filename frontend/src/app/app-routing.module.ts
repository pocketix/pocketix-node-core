import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeviceDetailDashboardComponent} from "./components/device-detail-dashboard/device-detail-dashboard.component";

const routes: Routes = [
	{path: "", component: DeviceDetailDashboardComponent, pathMatch: "full"}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
