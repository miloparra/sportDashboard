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
}

@Injectable({
  providedIn: 'root',
})
export class BikeService {
  private apiUrl = 'http://localhost:3000/api/outings';

  constructor(private http: HttpClient) {}

  // RECUPERATION DES RIDES
  getOutings(): Observable<Ride[]> {
    return this.http.get<Ride[]>(this.apiUrl);
  }

  // AJOUT D'UNE RIDE
  addRide(ride: Ride): Observable<any> {
    console.log('je passe bien dans le service  ' + this.apiUrl);
    return this.http.post(this.apiUrl, ride);
  }

  // SUPPRESSION D'UNE RIDE
  deleteRide(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.delete(url);
  }
}