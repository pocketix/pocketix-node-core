import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchDisplayComponent } from './switch-display.component';

describe('SwitchDisplayComponent', () => {
  let component: SwitchDisplayComponent;
  let fixture: ComponentFixture<SwitchDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
