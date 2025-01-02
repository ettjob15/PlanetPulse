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

  create(co2CalculatorHistory: Co2Calculator) {
    // Construct the payload for POST
    const payload = {
      ...co2CalculatorHistory,
      distanceMode_id: co2CalculatorHistory.distanceMode, // Send only the ID
    };

    // Remove distanceMode from the payload
    const { distanceMode, ...finalPayload } = payload;

    return this.http.post('/api/co2calculator/', finalPayload, { withCredentials: true });
  }

  // The update method to handle PUT requests without using the private modeMapping
  update(id: number, co2CalculatorHistory: Co2Calculator) {
    const { distanceMode, ...payload } = co2CalculatorHistory;
  
    // If distanceMode is already an ID (number), just send it
    const payloadWithId = {
      ...payload,
      distanceMode_id: distanceMode,  // Directly use the number
    };
  
    return this.http.put(`/api/co2calculator/${id}/`, payloadWithId, { withCredentials: true });
  }
  
  
}

