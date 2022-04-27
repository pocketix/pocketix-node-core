import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Categorical} from './categorical.component';
import {ParameterType} from "../../../../../generated/models/parameter-type";
import {Operation} from "../../../../../generated/models/operation";

describe('CategoricalComponent', () => {
  let component: Categorical;
  let fixture: ComponentFixture<Categorical>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Categorical ]
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
