import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCategoricalComponent } from './dashboard-categorical.component';
import {Device} from "../../../../generated/models/device";

describe('DashboardCategoricalComponent', () => {
  let component: DashboardCategoricalComponent;
  let fixture: ComponentFixture<DashboardCategoricalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCategoricalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCategoricalComponent);
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
