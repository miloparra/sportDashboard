import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Run {
  id: number;
  date_run: string;
  distance: number;
  cumul: number;
  vitesse: number;
  denivele: number;
  temps: string;
  formatted_date_run: string
}

export interface RunYear {
  year: string;
  distSum: string;
  timeSum: string;
  denivSUM: string
}

export interface RunWeek {
  week: string;
  yearweek: number;
  distSum: number;
  timeSum: number;
  denivSUM: number
}

@Injectable({
  providedIn: 'root',
})
export class RunService {
  private apiUrl = 'http://localhost:3000/api/runs';

  constructor(private http: HttpClient) { }

  // RECUPERATION DES RUNS
  getRuns(): Observable<Run[]> {
    return this.http.get<Run[]>(this.apiUrl);
  }

  // RECUPERATION D'UN RUN
  getRun(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.get(url);
  }

  // RECUPERATION DES MOYENNES PAR AN
  getRunYearTotal(): Observable<RunYear[]> {
    return this.http.get<RunYear[]>('http://localhost:3000/api/yearruns');
  }

  // RECUPERATION DES MOYENNES PAR SEMAINE
  getRunWeekTotal(): Observable<RunWeek[]> {
    return this.http.get<RunWeek[]>('http://localhost:3000/api/weekruns');
  }

  // AJOUT D'UN RUN
  addRun(run: Run): Observable<any> {
    return this.http.post(this.apiUrl, run);
  }

  // MODIFICATION D'UN RUN
  updateRun(id: number, run: Run): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.put(url, run);
  }

  // SUPPRESSION D'UN RUN
  deleteRun(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.delete(url);
  }
}