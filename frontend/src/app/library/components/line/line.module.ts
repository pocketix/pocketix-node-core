import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineComponent } from './components/line/line.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {TooltipModule} from "primeng/tooltip";
import {MultiSelectModule} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";



@NgModule({
  declarations: [
    LineComponent
  ],
  exports: [
    LineComponent
  ],
  imports: [
    CommonModule,
    NgxChartsModule,
    TooltipModule,
    MultiSelectModule,
    FormsModule,
    CalendarModule,
    DropdownModule
  ]
})
export class LineModule { }
