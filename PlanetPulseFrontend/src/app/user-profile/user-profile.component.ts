import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { Co2CalculatorService } from '../services/co2-calculator-service.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Co2Calculator } from '../interfaces/co2-calculator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule, 
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  username: string = '';
  profilePictureUrl: string = '';
  pollutionHistories: any[] = [];
  co2CalculatorHistories: any[] = [];
  showChangePassword: boolean = false;
  showChangeProfilePicture: boolean = false;
  changePasswordForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadPolutionMap();
    this.loadCo2CalculatorHistory();
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe(
      (profile) => {
        this.username = profile.username;
        this.profilePictureUrl = profile.profile?.profile_picture_url || '/assets/logo.png';
      },
      (error) => {
        this.snackBar.open('Failed to load user profile', 'Close', {
          duration: 3000,
        });
      }
    );
  }


  loadPolutionMap() {
    this.userService.getPolutionMap().subscribe(
      (data) => {
        this.pollutionHistories = data;
        console.log('Polution Map Data:', data);
      },
      (error) => {
        this.snackBar.open('Failed to load polution map', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  loadCo2CalculatorHistory() {
    this.http.get<Co2Calculator[]>('/api/co2calculator/').subscribe(
      (histories) => {
        this.co2CalculatorHistories = histories;
      },
      (error) => {
        this.snackBar.open('Failed to load CO2 calculator history', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  deletePollutionHistory(polutionHistoryId: number) {
    this.http.delete(`/api/polutionmap/${polutionHistoryId}/`).subscribe(
      () => {
        this.snackBar.open('Pollution history deleted', 'Close', {
          duration: 3000,
        });
        this.pollutionHistories = this.pollutionHistories.filter(
          (history) => history.id !== polutionHistoryId
        );
      },
      (error) => {
        this.snackBar.open('Failed to delete pollution history', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  deleteAllPollutionHistories() {
    this.http.delete(`/api/polutionmap/delete_all/`).subscribe(
      () => {
        this.snackBar.open('All pollution histories deleted', 'Close', {
          duration: 3000,
        });
        this.pollutionHistories = [];
      },
      (error) => {
        this.snackBar.open('Failed to delete all pollution histories', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  deleteCo2CalculatorHistory(co2CalculatorHistoryId: number) {
    this.http.delete(`/api/co2calculator/${co2CalculatorHistoryId}/`).subscribe(
      () => {
        this.snackBar.open('CO2 calculator history deleted', 'Close', {
          duration: 3000,
        });
        this.co2CalculatorHistories = this.co2CalculatorHistories.filter(
          (history) => history.id !== co2CalculatorHistoryId
        );
      },
      (error) => {
        this.snackBar.open('Failed to delete CO2 calculator history', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  deleteAllCo2CalculatorHistories() {
    this.http.delete(`/api/co2calculator/delete_all/`).subscribe(
      () => {
        this.snackBar.open('All CO2 calculator histories deleted', 'Close', {
          duration: 3000,
        });
        this.co2CalculatorHistories = [];
      },
      (error) => {
        this.snackBar.open('Failed to delete all CO2 calculator histories', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
  }

  cancelChangePassword() {
    this.showChangePassword = false;
    this.changePasswordForm.reset();
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const newPassword = this.changePasswordForm.value.newPassword;
      const repeatPassword = this.changePasswordForm.value.repeatPassword;

      if (newPassword !== repeatPassword) {
        this.snackBar.open('Passwords do not match', 'Close', {
          duration: 3000,
        });
        return;
      }

      this.http.post('/api/change-password/', { newPassword }).subscribe(
        () => {
          this.snackBar.open('Password changed successfully', 'Close', {
            duration: 3000,
          });
          this.cancelChangePassword();
        },
        (error) => {
          this.snackBar.open('Failed to change password', 'Close', {
            duration: 3000,
          });
        }
      );
    } else {
      if (this.changePasswordForm.hasError('passwordsMismatch')) {
        this.snackBar.open('Passwords do not match', 'Close', {
          duration: 3000,
        });
      } else if (this.changePasswordForm.get('newPassword')?.hasError('minlength')) {
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

  toggleChangeProfilePicture() {
    this.showChangeProfilePicture = !this.showChangeProfilePicture;
  }

  cancelChangeProfilePicture() {
    this.showChangeProfilePicture = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  changeProfilePicture(event: Event) {
    event.preventDefault();
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profile_picture', this.selectedFile);

      this.http.post('/api/upload-profile-picture/', formData).subscribe(
        (response: any) => {
          this.snackBar.open('Profile picture updated successfully', 'Close', {
            duration: 3000,
          });
          this.profilePictureUrl = response.profile_picture_url;
          this.cancelChangeProfilePicture();
        },
        (error) => {
          this.snackBar.open('Failed to update profile picture', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.logoutAndDeleteAccount();
    }
  }

  logoutAndDeleteAccount() {
    this.http.delete('/api/delete-account/').subscribe(
      () => {
        this.snackBar.open('Account deleted successfully', 'Close', {
          duration: 3000,
        });
        this.userService.logout();
      },
      (error) => {
        this.snackBar.open('Failed to delete account', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
