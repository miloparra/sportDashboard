import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ride {
  id: number;
  date_sortie: string;
  distance: number;
  cumul_coureur: number;
  cumul_velo: number;
  denivele: number;
  temps: string;
  parcours: string;
  formatted_date_sortie: string
}

export interface RideWeek {
  week: string;
  yearweek: number;
  distSum: number;
  timeSum: number;
  denivSUM: number
}

@Injectable({
  providedIn: 'root',
})
export class BikeService {
  private apiUrl = 'http://localhost:3000/api/outings';

  constructor(private http: HttpClient) { }

  // RECUPERATION DES RIDES
  getOutings(): Observable<Ride[]> {
    return this.http.get<Ride[]>(this.apiUrl);
  }

  // RECUPERATION UNE RIDE
  getRide(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.get(url);
  }

  // RECUPERATION DES MOYENNES PAR SEMAINE
  getRideWeekTotal(): Observable<RideWeek[]> {
    return this.http.get<RideWeek[]>('http://localhost:3000/api/weekrides');
  }

  // AJOUT D'UNE RIDE
  addRide(ride: Ride): Observable<any> {
    return this.http.post(this.apiUrl, ride);
  }

  // MODIFICATION D'UNE RIDE
  updateRide(id: number, ride: Ride): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.put(url, ride);
  }

  // SUPPRESSION D'UNE RIDE
  deleteRide(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.delete(url);
  }
}