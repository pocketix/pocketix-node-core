import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticDeviceDetailDashboard } from './statistic-device-detail-dashboard.component';

describe('DashboardL5Component', () => {
  let component: StatisticDeviceDetailDashboard;
  let fixture: ComponentFixture<StatisticDeviceDetailDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticDeviceDetailDashboard ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticDeviceDetailDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
