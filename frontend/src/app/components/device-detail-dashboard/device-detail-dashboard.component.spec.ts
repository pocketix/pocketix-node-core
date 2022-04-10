import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailDashboardComponent } from './device-detail-dashboard.component';

describe('DeviceDetailDashboardComponent', () => {
  let component: DeviceDetailDashboardComponent;
  let fixture: ComponentFixture<DeviceDetailDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceDetailDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDetailDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
