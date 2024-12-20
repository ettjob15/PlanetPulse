import { Routes } from '@angular/router';
import { PolutionMapComponent } from './polution-map/polution-map.component';
import { Co2CalculatorComponent } from './co2-calculator/co2-calculator.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/polution-map', pathMatch: 'full' },
  { path: 'polution-map', component: PolutionMapComponent  },
  { path: 'calculator', component: Co2CalculatorComponent},
  { path: 'imprint', component: ImprintComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'userprofile', component: UserProfileComponent},
];
