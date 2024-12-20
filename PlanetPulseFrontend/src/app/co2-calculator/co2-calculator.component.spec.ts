import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Co2CalculatorComponent } from './co2-calculator.component';

describe('Co2CalculatorComponent', () => {
  let component: Co2CalculatorComponent;
  let fixture: ComponentFixture<Co2CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Co2CalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Co2CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
