import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesOverviewComponent } from './devices-overview.component';

describe('DevicesOverviewComponent', () => {
  let component: DevicesOverviewComponent;
  let fixture: ComponentFixture<DevicesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicesOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
