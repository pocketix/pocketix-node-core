import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletChartComponent } from './bullet-chart.component';

describe('BulletChartComponent', () => {
  let component: BulletChartComponent;
  let fixture: ComponentFixture<BulletChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulletChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletChartComponent);
    component = fixture.componentInstance;
    component.update();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
