import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparklineComponent } from './sparkline.component';
import {LineChartModule} from "@swimlane/ngx-charts";
import {CheckboxModule} from "primeng/checkbox";
import {CommonModule} from "@angular/common";
import {ToggleButtonModule} from "primeng/togglebutton";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {FormsModule} from "@angular/forms";

describe('SparklineComponent', () => {
  let component: SparklineComponent;
  let fixture: ComponentFixture<SparklineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SparklineComponent ],
      imports: [
        CommonModule,
        ToggleButtonModule,
        RippleModule,
        TooltipModule,
        LineChartModule,
        CheckboxModule,
        FormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SparklineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
