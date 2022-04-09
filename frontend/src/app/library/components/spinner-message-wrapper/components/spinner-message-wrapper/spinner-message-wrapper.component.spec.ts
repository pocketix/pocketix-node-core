import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerMessageWrapperComponent } from './spinner-message-wrapper.component';

describe('LgmcGSpinnerMessageWrapperComponent', () => {
  let component: SpinnerMessageWrapperComponent;
  let fixture: ComponentFixture<SpinnerMessageWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinnerMessageWrapperComponent ]
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
