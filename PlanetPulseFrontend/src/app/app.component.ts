import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
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
  currentYear: number = new Date().getFullYear();
}
