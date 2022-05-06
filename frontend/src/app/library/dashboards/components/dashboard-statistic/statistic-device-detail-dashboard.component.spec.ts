import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticDeviceDetailDashboard } from './statistic-device-detail-dashboard.component';
import {Device} from "../../../../generated/models/device";
import {AvailabilityModule} from "../../../components/availability/availability.module";
import {MainChartTemplateModule} from "../../../components/main-chart-template/components/main-chart-template.module";
import {ToastModule} from "primeng/toast";
import {BulletChartModule} from "../../../components/bullet-chart/bullet-chart.module";
import {SparklineModule} from "../../../components/sparkline/sparkline.module";
import {LineModule} from "../../../components/line/line.module";
import {MessageService} from "primeng/api";
import {NgxChartsModule} from "@swimlane/ngx-charts";

describe('StatisticDeviceDetail', () => {
  let component: StatisticDeviceDetailDashboard;
  let fixture: ComponentFixture<StatisticDeviceDetailDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticDeviceDetailDashboard ],
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
    fixture = TestBed.createComponent(StatisticDeviceDetailDashboard);
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
    component.boxData = [];
    component.bulletsState = {
      data: [],
      device: device
    };
    component.sparklineState = {
      data: [],
      device,
      minMax: {}
    }
    component.device = device;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
