import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KeyValueDisplayComponent} from "./components/key-value-display/key-value-display.component";
import {TooltipModule} from "primeng/tooltip";
import { BreakAtSlashPipe } from './pipes/break-at-slash.pipe';



@NgModule({
  declarations: [
    KeyValueDisplayComponent,
    BreakAtSlashPipe
  ],
    imports: [
        CommonModule,
        TooltipModule
    ],
  exports: [
    KeyValueDisplayComponent
  ]
})
export class KeyValueDisplayModule { }
