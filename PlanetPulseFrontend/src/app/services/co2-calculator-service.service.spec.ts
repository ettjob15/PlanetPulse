import { TestBed } from '@angular/core/testing';

import { Co2CalculatorService} from './co2-calculator-service.service';

describe('Co2CalculatorServiceService', () => {
  let service: Co2CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Co2CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
