import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AvailabilityLinearGaugeComponent} from "./components/availability-linear-gauge/availability-linear-gauge.component";
import {GaugeModule, LineChartModule} from "@swimlane/ngx-charts";
import {AvailabilityComponent} from "./components/availability-component/availability.component";
import {SingleSensorComponent} from "./components/single-sensor/single-sensor.component";
import {ModalComponent} from "./components/modal/modal.component";



@NgModule({
  declarations: [
    AvailabilityLinearGaugeComponent,
    AvailabilityComponent,
    SingleSensorComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    GaugeModule,
    LineChartModule,
  ],
  exports: [
    AvailabilityLinearGaugeComponent,
    AvailabilityComponent,
    SingleSensorComponent
  ]
})
export class AvailabilityModule { }
