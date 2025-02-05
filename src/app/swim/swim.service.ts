import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Swim {
  id: number;
  date_swim: string;
  temps: string;
  distance: number;
  cumul: number;
  vitesse: number;
  formatted_date_swim: string
}

export interface SwimYear {
  year: string;
  distSum: number;
  timeSum: number
}

export interface SwimWeek {
  week: string;
  yearweek: number;
  distSum: number;
  timeSum: number
}

@Injectable({
  providedIn: 'root',
})
export class SwimService {
  private apiUrl = 'http://localhost:3000/api/swims';

  constructor(private http: HttpClient) { }

  // RECUPERATION DES SWIMS
  getSwims(): Observable<Swim[]> {
    return this.http.get<Swim[]>(this.apiUrl);
  }

  // RECUPERATION D'UNE SWIM
  getSwim(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.get(url);
  }

  // RECUPERATION DES MOYENNES PAR AN
  getSwimYearTotal(): Observable<SwimYear[]> {
    return this.http.get<SwimYear[]>('http://localhost:3000/api/yearswims');
  }

  // RECUPERATION DES MOYENNES PAR SEMAINE
  getSwimWeekTotal(): Observable<SwimWeek[]> {
    return this.http.get<SwimWeek[]>('http://localhost:3000/api/weekswims');
  }

  // AJOUT D'UNE SWIM
  addSwim(swim: Swim): Observable<any> {
    return this.http.post(this.apiUrl, swim);
  }

  // MODIFICATION D'UNE SWIM
  updateSwim(id: number, swim: Swim): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.put(url, swim);
  }

  // SUPPRESSION D'UNE SWIM
  deleteSwim(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.delete(url);
  }
}