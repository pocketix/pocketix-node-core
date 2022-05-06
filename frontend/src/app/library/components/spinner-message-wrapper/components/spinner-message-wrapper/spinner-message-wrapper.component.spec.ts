import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerMessageWrapperComponent } from './spinner-message-wrapper.component';
import {CommonModule} from "@angular/common";

describe('SpinnerMessageWrapperComponent', () => {
  let component: SpinnerMessageWrapperComponent;
  let fixture: ComponentFixture<SpinnerMessageWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinnerMessageWrapperComponent ],
      imports: [
        CommonModule,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerMessageWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
