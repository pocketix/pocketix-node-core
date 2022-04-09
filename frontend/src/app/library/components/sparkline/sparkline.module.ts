import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SparklineComponent } from './components/sparkline/sparkline.component';
import {ToggleButtonModule} from "primeng/togglebutton";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {LineChartModule} from "@swimlane/ngx-charts";



@NgModule({
  declarations: [
    SparklineComponent
  ],
  exports: [
    SparklineComponent
  ],
  imports: [
    CommonModule,
    ToggleButtonModule,
    RippleModule,
    TooltipModule,
    LineChartModule
  ]
})
export class SparklineModule { }
