import { Injectable } from '@angular/core';
import { Co2Calculator } from '../interfaces/co2-calculator';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Co2CalculatorService {

  constructor(private http: HttpClient) { }
  getCo2CalculatorHistory() {
    return this.http.get<Co2Calculator[]>('/api/co2calculator/');
  }
  create(Co2CalculatorHistory: Co2Calculator) {
    return this.http.post('/api/co2calculator/', Co2CalculatorHistory, { withCredentials: true });
  }
}
