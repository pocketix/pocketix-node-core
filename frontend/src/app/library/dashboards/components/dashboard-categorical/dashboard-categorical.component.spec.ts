import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCategoricalComponent } from './dashboard-categorical.component';
import {Device} from "../../../../generated/models/device";
import {CategoricalModule} from "../../../components/categorical/categorical.module";
import {SwitchDisplayModule} from "../../../components/switch-display/switch-display.module";
import {KeyValueDisplayModule} from "../../../components/key-value-display/key-value-display.module";
import {BulletChartModule} from "../../../components/bullet-chart/bullet-chart.module";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {ParameterType} from "../../../../generated/models/parameter-type";
import {Operation} from "../../../../generated/models/operation";
import {NgxChartsModule} from "@swimlane/ngx-charts";

describe('DashboardCategoricalComponent', () => {
  let component: DashboardCategoricalComponent;
  let fixture: ComponentFixture<DashboardCategoricalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCategoricalComponent ],
      imports: [
        CategoricalModule,
        SwitchDisplayModule,
        KeyValueDisplayModule,
        BulletChartModule,
        ToastModule,
        NgxChartsModule
      ],
      providers: [
        MessageService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCategoricalComponent);
    component = fixture.componentInstance;
    const device = {
      description: "",
      deviceName: "",
      deviceUid: "",
      lastSeenDate: "",
      latitude: 0,
      longitude: 0,
      registrationDate: "",
    } as Device;

    device.type = {
      devices: [device],
      id: 1,
      name: ""
    };
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
    component.device = device;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
