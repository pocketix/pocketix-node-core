import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailDashboardComponent } from './device-detail-dashboard.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('DeviceDetailDashboardComponent', () => {
  let component: DeviceDetailDashboardComponent;
  let fixture: ComponentFixture<DeviceDetailDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
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
