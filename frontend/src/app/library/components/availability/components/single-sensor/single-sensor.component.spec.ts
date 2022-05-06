import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSensorComponent } from './single-sensor.component';
import {Device} from "../../../../../generated/models/device";
import {CommonModule} from "@angular/common";
import {MapModule} from "../../../map/map.module";
import {SparklineModule} from "../../../sparkline/sparkline.module";
import {KeyValueDisplayModule} from "../../../key-value-display/key-value-display.module";
import {AvailabilityLinearGaugeComponent} from "../availability-linear-gauge/availability-linear-gauge.component";

describe('SingleSensorComponent', () => {
  let component: SingleSensorComponent;
  let fixture: ComponentFixture<SingleSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleSensorComponent, AvailabilityLinearGaugeComponent ],
      imports: [
        CommonModule,
        MapModule,
        SparklineModule,
        KeyValueDisplayModule
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSensorComponent);
    component = fixture.componentInstance;
    component.sensorAvailability = [];
    component.sensorSparkline = {
      data: [],
      device: {latitude: 0, longitude: 0} as Device,
      minMax: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
