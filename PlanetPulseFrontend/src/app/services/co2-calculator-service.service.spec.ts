import { TestBed } from '@angular/core/testing';

import { Co2CalculatorServiceService } from './co2-calculator-service.service';

describe('Co2CalculatorServiceService', () => {
  let service: Co2CalculatorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Co2CalculatorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
