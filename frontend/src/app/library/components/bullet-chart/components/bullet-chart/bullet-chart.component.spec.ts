import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletChartComponent } from './bullet-chart.component';

describe('LgmcGBulletChartComponent', () => {
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
