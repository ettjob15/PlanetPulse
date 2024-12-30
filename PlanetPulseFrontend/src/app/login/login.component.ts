import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackbar: MatSnackBar,
    private userService: UserService,
  ) {
    this.loginFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  login(): void {
    if (this.loginFormGroup.valid) {
      const userData = this.loginFormGroup.value;
      this.userService.login(userData);
    }
  }
}
