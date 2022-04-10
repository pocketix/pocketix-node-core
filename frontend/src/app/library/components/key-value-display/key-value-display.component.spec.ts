import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyValueDisplayComponent } from './key-value-display.component';

describe('KeyValueDisplayComponent', () => {
  let component: KeyValueDisplayComponent;
  let fixture: ComponentFixture<KeyValueDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyValueDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValueDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
