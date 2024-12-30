import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StarRatingModule } from 'angular-star-rating';
import { routes } from './app.routes';



export function tokenGetter() {
  return localStorage.getItem("access_token")
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(StarRatingModule.forRoot()),
    importProvidersFrom(JwtModule.forRoot({
    config:{
      tokenGetter:tokenGetter,
      allowedDomains:["localhost:4200"]
    }
    })),
  ],
};