import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticDeviceDetailDashboard } from './statistic-device-detail-dashboard.component';
import {Device} from "../../../../generated/models/device";

describe('StatisticDeviceDetail', () => {
  let component: StatisticDeviceDetailDashboard;
  let fixture: ComponentFixture<StatisticDeviceDetailDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticDeviceDetailDashboard ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticDeviceDetailDashboard);
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
    component.boxData = [];
    component.bulletsState = {
      data: [],
      device: device
    };
    component.sparklineState = {
      data: [],
      device,
      minMax: {}
    }
    component.device = device;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
