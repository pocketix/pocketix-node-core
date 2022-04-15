import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Categorical } from './categorical.component';

describe('LgmcGuiDeviceDayDetailsComponent', () => {
  let component: Categorical;
  let fixture: ComponentFixture<Categorical>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Categorical ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Categorical);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
