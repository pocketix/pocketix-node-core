import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChartTemplateComponent } from './main-chart-template.component';
import {CommonModule} from "@angular/common";
import {InputSwitchModule} from "primeng/inputswitch";

describe('MainChartTemplateComponent', () => {
  let component: MainChartTemplateComponent;
  let fixture: ComponentFixture<MainChartTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainChartTemplateComponent ],
      imports: [
        CommonModule,
        InputSwitchModule
      ]
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
