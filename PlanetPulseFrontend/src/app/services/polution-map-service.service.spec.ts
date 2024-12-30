import { TestBed } from '@angular/core/testing';

import { PolutionMapServiceService } from './polution-map-service.service';

describe('PolutionMapServiceService', () => {
  let service: PolutionMapServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolutionMapServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
