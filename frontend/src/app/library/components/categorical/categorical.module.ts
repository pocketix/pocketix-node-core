import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateService} from "@ngx-translate/core";
import {Categorical} from "./components/categorical/categorical.component";
import {MultiSelectModule} from "primeng/multiselect";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {SpinnerMessageWrapperModule} from "../spinner-message-wrapper/spinner-message-wrapper.module";
import {BarchartModule} from "../barchart/barchart.module";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {BarChartModule} from "@swimlane/ngx-charts";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    Categorical
  ],
  imports: [
    CommonModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    SpinnerMessageWrapperModule,
    BarchartModule,
    ProgressSpinnerModule,
    BarChartModule,
    RippleModule,
    InputTextModule,
    FormsModule
  ],
  exports: [
    Categorical
  ],
  providers: [
    TranslateService
  ]
})
export class CategoricalModule { }
