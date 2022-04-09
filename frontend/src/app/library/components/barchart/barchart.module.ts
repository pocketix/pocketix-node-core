import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarchartComponent } from './components/barchart/barchart.component';
import {BarChartModule} from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    BarchartComponent
  ],
  imports: [
    CommonModule,
    BarChartModule
  ],
  exports: [
    BarchartComponent
  ]
})
export class BarchartModule { }
