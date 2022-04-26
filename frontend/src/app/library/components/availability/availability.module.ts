import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  AvailabilityLinearGaugeComponent
} from "./components/availability-linear-gauge/availability-linear-gauge.component";
import {GaugeModule, LineChartModule} from "@swimlane/ngx-charts";
import {AvailabilityComponent} from "./components/availability-component/availability.component";
import {SingleSensorComponent} from "./components/single-sensor/single-sensor.component";
import {DialogModule} from "primeng/dialog";
import {MapModule} from "../map/map.module";
import {SparklineModule} from "../sparkline/sparkline.module";


@NgModule({
  declarations: [
    AvailabilityLinearGaugeComponent,
    AvailabilityComponent,
    SingleSensorComponent
  ],
  imports: [
    CommonModule,
    GaugeModule,
    LineChartModule,
    DialogModule,
    MapModule,
    SparklineModule,
  ],
  exports: [
    AvailabilityLinearGaugeComponent,
    AvailabilityComponent,
    SingleSensorComponent
  ]
})
export class AvailabilityModule {
}
