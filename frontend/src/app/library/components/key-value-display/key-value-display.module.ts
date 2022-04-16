import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KeyValueDisplayComponent} from "./components/key-value-display/key-value-display.component";



@NgModule({
  declarations: [
    KeyValueDisplayComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    KeyValueDisplayComponent
  ]
})
export class KeyValueDisplayModule { }
