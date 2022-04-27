import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSensorComponent } from './single-sensor.component';
import {Device} from "../../../../../generated/models/device";

describe('SingleSensorComponent', () => {
  let component: SingleSensorComponent;
  let fixture: ComponentFixture<SingleSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleSensorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSensorComponent);
    component = fixture.componentInstance;
    component.sensorAvailability = [];
    component.sensorSparkline = {
      data: [],
      device: {} as Device,
      minMax: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
