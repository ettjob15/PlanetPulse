import { Component, signal } from '@angular/core';
import * as L from 'leaflet';
import { OpenweatherService } from '../services/openweather.service';



@Component({
  selector: 'app-polution-map',
  standalone: true,
  imports: [],
  templateUrl: './polution-map.component.html',
  styleUrl: './polution-map.component.scss'
})
export class PolutionMapComponent {
  cityName = signal('');
  airQualityIndex = signal<number | null>(null);
  map!: L.Map;
  marker!: L.Marker;

  constructor(private openWeatherService: OpenweatherService) {}

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = L.map('map').setView([48.8566, 2.3522], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  searchCity() {
    const city = this.cityName(); 
    if (!city) return;

    this.openWeatherService.getCityCoordinates(city).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const { lat, lon } = res[0];
          this.updateMapLocation(lat, lon);

          this.openWeatherService.getAirPollution(lat, lon).subscribe({
            next: (pollutionData) => {
              // OpenWeather structure => pollutionData.list[0].main.aqi
              this.airQualityIndex.set(pollutionData.list[0].main.aqi);
            },
            error: (err) => console.error(err),
          });
        } else {
          console.error('City not found');
        }
      },
      error: (err) => console.error(err),
    });
  }

  updateMapLocation(lat: number, lon: number) {
    this.map.setView([lat, lon], 10);

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    // Add a new marker at the specified location
    this.marker = L.marker([lat, lon]).addTo(this.map);
  }
}

