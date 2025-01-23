import { Injectable } from '@angular/core';
import { Page, PolutionMapHistory } from '../interfaces/polutionmap';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PolutionMapServiceService {
  delete(id: number) {
    let params: any = {};
    if (id) params['id'] = id;
    return this.http.delete(`/api/polutionmap/${id}/`);
  }

  constructor(private http: HttpClient) { }
  getPolutionMapUserHistory(polutionIndex: string | null, sortOption: string | null) {
    let params: any = {};
    if (polutionIndex) params['polutionIndex'] = polutionIndex;
    if(sortOption) params['sortOption'] = sortOption;
    return this.http.get<PolutionMapHistory[]>('/api/polutionmap/', { params });
  }
  create(polutionMapHistory: PolutionMapHistory) {
    return this.http.post('/api/polutionmap/', polutionMapHistory, { withCredentials: true });
  }
}
