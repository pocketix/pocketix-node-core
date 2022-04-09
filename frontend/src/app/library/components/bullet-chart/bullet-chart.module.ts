import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletChartComponent } from './components/bullet-chart/bullet-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';



@NgModule({
  declarations: [BulletChartComponent],
  exports: [
   BulletChartComponent
  ],
  imports: [
    CommonModule,
    NgxChartsModule
  ]
})
export class BulletChartModule { }
