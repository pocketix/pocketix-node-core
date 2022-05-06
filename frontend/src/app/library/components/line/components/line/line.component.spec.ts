import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineComponent } from './line.component';
import {CommonModule} from "@angular/common";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {TooltipModule} from "primeng/tooltip";
import {MultiSelectModule} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";

describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineComponent ],
      imports: [
        CommonModule,
        NgxChartsModule,
        TooltipModule,
        MultiSelectModule,
        FormsModule,
        CalendarModule,
        DropdownModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
