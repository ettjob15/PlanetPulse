import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authHideGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.isLoggedIn$.pipe(map((isLoggedIn) => {
  if (isLoggedIn) {
  router.navigate(['polution-map']);
  }
  return !isLoggedIn;
  }));
  };