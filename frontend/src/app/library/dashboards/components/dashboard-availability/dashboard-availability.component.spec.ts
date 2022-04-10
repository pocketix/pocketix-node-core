import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAvailabilityComponent } from './dashboard-availability.component';

describe('DashboardAvailabilityComponent', () => {
  let component: DashboardAvailabilityComponent;
  let fixture: ComponentFixture<DashboardAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAvailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
