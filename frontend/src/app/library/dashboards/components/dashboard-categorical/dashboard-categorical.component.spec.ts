import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCategoricalComponent } from './dashboard-categorical.component';

describe('CategoricalComponent', () => {
  let component: DashboardCategoricalComponent;
  let fixture: ComponentFixture<DashboardCategoricalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCategoricalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCategoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
