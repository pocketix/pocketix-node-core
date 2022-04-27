import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DeviceAvailabilityDashboardComponent } from './device-availability-dashboard.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('DeviceAvailabilityDashboardComponent', () => {
  let component: DeviceAvailabilityDashboardComponent;
  let fixture: ComponentFixture<DeviceAvailabilityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
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
