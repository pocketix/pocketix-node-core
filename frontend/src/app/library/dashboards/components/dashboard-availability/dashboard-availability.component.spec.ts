import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAvailabilityComponent } from './dashboard-availability.component';
import {Device} from "../../../../generated/models/device";
import {AvailabilityModule} from "../../../components/availability/availability.module";
import {MainChartTemplateModule} from "../../../components/main-chart-template/components/main-chart-template.module";
import {ToastModule} from "primeng/toast";
import {BulletChartModule} from "../../../components/bullet-chart/bullet-chart.module";
import {SparklineModule} from "../../../components/sparkline/sparkline.module";
import {LineModule} from "../../../components/line/line.module";
import {MessageService} from "primeng/api";
import {NgxChartsModule} from "@swimlane/ngx-charts";

describe('DashboardAvailabilityComponent', () => {
  let component: DashboardAvailabilityComponent;
  let fixture: ComponentFixture<DashboardAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAvailabilityComponent ],
      imports: [
        AvailabilityModule,
        MainChartTemplateModule,
        ToastModule,
        BulletChartModule,
        SparklineModule,
        LineModule,
        NgxChartsModule
      ],
      providers: [
        MessageService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAvailabilityComponent);
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
    component.device = device;
    component.boxData = [];
    component.sparklineState = {
      data: [],
      device,
      minMax: {}
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
