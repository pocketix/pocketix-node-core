import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainChartTemplateComponent} from "./main-chart-template/main-chart-template.component";
import {InputSwitchModule} from "primeng/inputswitch";



@NgModule({
  declarations: [
    MainChartTemplateComponent
  ],
  imports: [
    CommonModule,
    InputSwitchModule
  ],
  exports: [
    MainChartTemplateComponent
  ]
})
export class MainChartTemplateModule { }
