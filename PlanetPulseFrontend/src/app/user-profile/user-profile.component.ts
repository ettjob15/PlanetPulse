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
    MatSelectModule, // Import MatSelectModule here
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  username: string = '';
  pollutionHistories: any[] = [];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadPolutionMap();
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe(
      (profile) => {
        this.username = profile.username;
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

}