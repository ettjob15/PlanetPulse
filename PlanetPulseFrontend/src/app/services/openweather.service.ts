import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenweatherService {
private API_KEY = '96cf371a37e6bdeaa0cf099db6237485';

constructor(private http: HttpClient) {}
  getCityCoordinates(cityName: string): Observable<any> {
    const url = 'https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.API_KEY}';
    return this.http.get(url);
  }

  getAirPollution(lat: number, lon: number): Observable<any> {
    const url = 'https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.API_KEY}';
    return this.http.get(url);
  }
}

