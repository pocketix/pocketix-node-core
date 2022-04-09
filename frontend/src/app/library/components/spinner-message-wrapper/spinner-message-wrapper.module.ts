import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerMessageWrapperComponent } from './components/spinner-message-wrapper/spinner-message-wrapper.component';



@NgModule({
  declarations: [
    SpinnerMessageWrapperComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SpinnerMessageWrapperComponent
  ]
})
export class SpinnerMessageWrapperModule { }
