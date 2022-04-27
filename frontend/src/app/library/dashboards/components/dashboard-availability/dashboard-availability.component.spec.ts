import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAvailabilityComponent } from './dashboard-availability.component';
import {Device} from "../../../../generated/models/device";

describe('DashboardAvailabilityComponent', () => {
  let component: DashboardAvailabilityComponent;
  let fixture: ComponentFixture<DashboardAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAvailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAvailabilityComponent);
    component = fixture.componentInstance;
    const device = {
      description: "",
      deviceName: "",
      deviceUid: "",
      lastSeenDate: "",
      latitude: 0,
      longitude: 0,
      registrationDate: "",
    } as Device;

    device.type = {
      devices: [device],
      id: 1,
      name: ""
    };
    component.device = device;
    component.boxData = [];
    component.sparklineState = {
      data: [],
      device,
      minMax: {}
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
