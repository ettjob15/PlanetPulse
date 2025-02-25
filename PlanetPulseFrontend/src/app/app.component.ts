import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from './services/user.service';
import{Chart,registerables} from 'chart.js';
;

Chart.register(...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ 
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PlanetPulseFrontend';
  constructor(public userService:UserService){}
  currentYear: number = new Date().getFullYear();
  username: string = '';
  profilePictureUrl: string = '';

  logout(): void {
    this.userService.logout();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (profile) => {
        this.username = profile.username;
        this.profilePictureUrl = profile.profile?.profile_picture_url || '/assets/logo.png';
      },
      (error) => {
        console.error('Failed to load user profile:', error);
      }
    );
  }

}

