import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoricalDashboardComponent } from './categorical-dashboard.component';

describe('CategoricalDashboardComponent', () => {
  let component: CategoricalDashboardComponent;
  let fixture: ComponentFixture<CategoricalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoricalDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoricalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
