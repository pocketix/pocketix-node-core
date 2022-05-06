import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletChartComponent } from './bullet-chart.component';
import {CommonModule} from "@angular/common";
import {GaugeModule, NgxChartsModule} from "@swimlane/ngx-charts";

describe('BulletChartComponent', () => {
  let component: BulletChartComponent;
  let fixture: ComponentFixture<BulletChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulletChartComponent ],
      imports: [
        CommonModule,
        NgxChartsModule,
        GaugeModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletChartComponent);
    component = fixture.componentInstance;
    component.update();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
