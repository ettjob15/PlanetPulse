import { Routes } from '@angular/router';
import { PolutionMapComponent } from './polution-map/polution-map.component';
import { Co2CalculatorComponent } from './co2-calculator/co2-calculator.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { authGuard } from './auth.guard';
import { authHideGuard } from './auth-hide.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path: '', redirectTo: '/polution-map', pathMatch: 'full' },
  { path: 'polution-map', component: PolutionMapComponent  },
  { path: 'calculator', component: Co2CalculatorComponent},
  { path: 'imprint', component: ImprintComponent },
  { path: 'login', component: LoginComponent, canActivate: [authHideGuard]},
  { path: 'register', component: RegisterComponent ,canActivate: [authHideGuard]},
  { path: 'userprofile', component: UserProfileComponent, canActivate: [authGuard]},
  { path: 'aboutUs', component: AboutUsComponent},
  { path: 'privacy-policy', component: PrivacyPolicyComponent},
  { path: '**', component: NotFoundComponent },


];
