import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OpenweatherService {
private API_KEY = environment.apiKey;
constructor(private http: HttpClient) {}
  getCityCoordinates(cityName: string): Observable<any> {
    const url = environment.apiMapUrl+`?q=${cityName}&limit=1&appid=${this.API_KEY}`;
    return this.http.get(url);
  }

  getAirPollution(lat: number, lon: number): Observable<any> {
    const url = environment.apiPollutionUri+`?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`;
    return this.http.get(url);
  }
}

