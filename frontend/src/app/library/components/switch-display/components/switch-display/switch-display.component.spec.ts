import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchDisplayComponent } from './switch-display.component';
import {CommonModule} from "@angular/common";

describe('SwitchDisplayComponent', () => {
  let component: SwitchDisplayComponent;
  let fixture: ComponentFixture<SwitchDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchDisplayComponent ],
      imports: [
        CommonModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchDisplayComponent);
    component = fixture.componentInstance;
    component.data = [
      {
        "result": "_result",
        "table": 0,
        "sensor": "boiler",
        "time": "2022-04-26T22:58:00Z",
        "boiler_status": 2,
        "out_pomp1": 0
      },
      {
        "result": "_result",
        "table": 0,
        "sensor": "boiler",
        "time": "2022-04-26T23:18:00Z",
        "boiler_status": 1,
        "out_pomp1": 0
      },
      {
        "result": "_result",
        "table": 0,
        "sensor": "boiler",
        "time": "2022-04-27T00:39:00Z",
        "boiler_status": 2,
        "out_pomp1": 0
      },
      {
        "result": "_result",
        "table": 0,
        "sensor": "boiler",
        "time": "2022-04-27T01:07:00Z",
        "boiler_status": 1,
        "out_pomp1": 0
      }
    ]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
