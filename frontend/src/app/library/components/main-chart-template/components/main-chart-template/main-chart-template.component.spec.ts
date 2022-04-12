import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChartTemplateComponent } from './main-chart-template.component';

describe('MainChartTemplateComponent', () => {
  let component: MainChartTemplateComponent;
  let fixture: ComponentFixture<MainChartTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainChartTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainChartTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
