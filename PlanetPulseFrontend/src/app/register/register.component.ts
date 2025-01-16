import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe(
        (response) => {
          this.snackBar.open('Registration successful', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.status === 400 && error.error.username) {
            this.snackBar.open('Username already exists', 'Close', {
              duration: 3000,
            });
          } else {
            this.snackBar.open('Registration failed', 'Close', {
              duration: 3000,
            });
          }
        }
      );
    } else {
      if (this.registerForm.hasError('passwordsMismatch')) {
        this.snackBar.open('Passwords do not match', 'Close', {
          duration: 3000,
        });
      } else if (this.registerForm.get('password')?.hasError('minlength')) {
        this.snackBar.open('Password is too short, must be at least 6 characters', 'Close', {
          duration: 3000,
        });
      } else {
        this.snackBar.open('Form is invalid', 'Close', {
          duration: 3000,
        });
      }
    }
  }
}