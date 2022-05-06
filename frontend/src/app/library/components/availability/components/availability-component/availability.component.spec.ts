import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityComponent } from './availability.component';
import {Device} from "../../../../../generated/models/device";
import {SingleSensorComponent} from "../single-sensor/single-sensor.component";
import {AvailabilityLinearGaugeComponent} from "../availability-linear-gauge/availability-linear-gauge.component";
import {DialogModule} from "primeng/dialog";

describe('AvailabilityComponent', () => {
  let component: AvailabilityComponent;
  let fixture: ComponentFixture<AvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailabilityComponent, SingleSensorComponent, AvailabilityLinearGaugeComponent ],
      imports: [
        DialogModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityComponent);
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
    component.availabilities = [{
      text: "Availability",
      value: 1,
      target: 100
    }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
