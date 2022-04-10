import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SparklineComponent } from './components/sparkline/sparkline.component';
import {ToggleButtonModule} from "primeng/togglebutton";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {LineChartModule} from "@swimlane/ngx-charts";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";



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
    LineChartModule,
    CheckboxModule,
    FormsModule
  ]
})
export class SparklineModule { }
