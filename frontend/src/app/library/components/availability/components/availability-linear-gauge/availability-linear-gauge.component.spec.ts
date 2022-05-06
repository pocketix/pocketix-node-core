import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityLinearGaugeComponent } from './availability-linear-gauge.component';
import {GaugeModule} from "@swimlane/ngx-charts";

describe('AvailabilityLinearGaugeComponent', () => {
  let component: AvailabilityLinearGaugeComponent;
  let fixture: ComponentFixture<AvailabilityLinearGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityLinearGaugeComponent ],
      imports: [
        GaugeModule
      ]
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
