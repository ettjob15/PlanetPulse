import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authHideGuard } from './auth-hide.guard';

describe('authHideGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authHideGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
