import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SwitchDisplayComponent} from "./components/switch-display/switch-display.component";



@NgModule({
  declarations: [
    SwitchDisplayComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SwitchDisplayComponent
  ]
})
export class SwitchDisplayModule { }
