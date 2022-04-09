import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityLinearGaugeComponent } from './availability-linear-gauge.component';

describe('AvailabilityLinearGaugeComponent', () => {
  let component: AvailabilityLinearGaugeComponent;
  let fixture: ComponentFixture<AvailabilityLinearGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityLinearGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityLinearGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
