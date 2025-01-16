import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly accessTokenLocalStorageKey = 'access_token';
  isLoggedIn$ = new BehaviorSubject(false);
  isLoggedInSignal = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelperService: JwtHelperService,
    private snackbar: MatSnackBar,
  ) {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    if (token) {
      console.log(
        'Token expiration date: ' +
          this.jwtHelperService.getTokenExpirationDate(token),
      );
      const tokenValid = !this.jwtHelperService.isTokenExpired(token);
      this.isLoggedIn$.next(tokenValid);
       this.isLoggedInSignal.set(tokenValid);
    }
  }

  hasPermission(permission: string): boolean {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    const decodedToken = this.jwtHelperService.decodeToken(token ? token : '');
    const permissions = decodedToken?.permissions;
    return permissions ? permission in permissions : false;
    }

    register(userData: { username: string; password: string }): Observable<any> {
      return this.http.post('/api/register/', userData);
    }

  login(userData: { username: string; password: string }): void {
    this.http.post('/api/token/', userData).subscribe({
      next: (res: any) => {
        this.isLoggedIn$.next(true);
        this.isLoggedInSignal.set(true);
        localStorage.setItem('access_token', res.access);
        this.router.navigate(['polution-map']);
        this.snackbar.open('Successfully logged in', 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackbar.open('Invalid credentials', 'OK', { duration: 3000 });
      },
    });
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenLocalStorageKey);
    this.isLoggedIn$.next(false);
    this.isLoggedInSignal.set(false);
    this.router.navigate(['polution-map']);
  }
}
