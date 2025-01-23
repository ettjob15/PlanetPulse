import { Injectable } from '@angular/core';
import { Co2Calculator } from '../interfaces/co2-calculator';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Co2CalculatorService {
  delete(id: number) {
      let params: any = {};
      if (id) params['id'] = id;
      return this.http.delete(`/api/co2calculator/${id}/`);
    }

  constructor(private http: HttpClient) { }

  getCo2CalculatorHistory(distanceMode?: string,
    sortByDistance?: string,
    sortByCo2?: string,
    sortByDate?: string,
    search?: string) {
    let params: any = {};
    if (distanceMode) params['distanceMode'] = distanceMode;
    if (sortByDistance) params['sortByDistance'] = sortByDistance;
    if (sortByCo2) params['sortByCo2'] = sortByCo2;
    if (sortByDate) params['sortByDate'] = sortByDate;
    if (search) params['search'] = search;

    return this.http.get<Co2Calculator[]>('/api/co2calculator/', { params });
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

