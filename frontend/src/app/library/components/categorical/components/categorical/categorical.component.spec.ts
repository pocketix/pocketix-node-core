import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Categorical} from './categorical.component';
import {ParameterType} from "../../../../../generated/models/parameter-type";
import {Operation} from "../../../../../generated/models/operation";
import {CommonModule} from "@angular/common";
import {MultiSelectModule} from "primeng/multiselect";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {SpinnerMessageWrapperModule} from "../../../spinner-message-wrapper/spinner-message-wrapper.module";
import {BarchartModule} from "../../../barchart/barchart.module";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {BarChartModule} from "@swimlane/ngx-charts";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

describe('CategoricalComponent', () => {
  let component: Categorical;
  let fixture: ComponentFixture<Categorical>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Categorical ],
      imports: [
        CommonModule,
        MultiSelectModule,
        CalendarModule,
        DropdownModule,
        SpinnerMessageWrapperModule,
        BarchartModule,
        ProgressSpinnerModule,
        BarChartModule,
        RippleModule,
        InputTextModule,
        FormsModule
      ],
      providers: [
        TranslateService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Categorical);
    component = fixture.componentInstance;
    component.deviceUid = "Device ID";
    component.currentDay = {
      date: new Date(),
      fields: [{} as ParameterType],
      dataLoading: true,
      allAggregationOperations: [Operation.Mean],
      selectedAggregationOperation: Operation.Mean,
      switchComposition: [],
      data: []
    };
    component.pastDays = {
      data: [],
      dataLoading: false,
      endDate: new Date(),
      startDate: new Date(),
      ticks: []
    };
    component.KPIs = {
      all: [],
      default: []
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
