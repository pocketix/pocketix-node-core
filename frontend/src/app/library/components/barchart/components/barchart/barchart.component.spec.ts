import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartComponent } from './barchart.component';
import {CommonModule} from "@angular/common";
import {BarChartModule} from "@swimlane/ngx-charts";

describe('BarchartComponent', () => {
  let component: BarchartComponent;
  let fixture: ComponentFixture<BarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarchartComponent ],
      imports: [
        CommonModule,
        BarChartModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
