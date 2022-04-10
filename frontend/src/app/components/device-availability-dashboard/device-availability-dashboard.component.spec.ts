import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAvailabilityDashboardComponent } from './device-availability-dashboard.component';

describe('DeviceAvailabilityDashboardComponent', () => {
  let component: DeviceAvailabilityDashboardComponent;
  let fixture: ComponentFixture<DeviceAvailabilityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceAvailabilityDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAvailabilityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
