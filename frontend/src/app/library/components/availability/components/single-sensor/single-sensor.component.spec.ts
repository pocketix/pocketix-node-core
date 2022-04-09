import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSensorComponent } from './single-sensor.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
