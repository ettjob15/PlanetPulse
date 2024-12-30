import { Injectable } from '@angular/core';
import { Page, PolutionMapHistory } from '../interfaces/polutionmap';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PolutionMapServiceService {

  constructor(private http: HttpClient) { }
  getPolutionMapUserHistory() {
    return this.http.get<PolutionMapHistory[]>('/api/polutionmap/');
  }
  create(polutionMapHistory: PolutionMapHistory) {
    return this.http.post('/api/polutionmap/', polutionMapHistory, { withCredentials: true });
  }
}
