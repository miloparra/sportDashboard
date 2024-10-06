import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Seance {
  id: number;
  date_fitness: string
}

export interface Exercice {
  id: number;
  name_exo: string
}

export interface Serie {
  id: number;
  nb_serie: number;
  nb_repetition: number;
  weight: number;
  type_serie: string
}

@Injectable({
  providedIn: 'root',
})
export class FitnessService {
  private apiUrl = 'http://localhost:3000/api/seances';

  constructor(private http: HttpClient) {}

  // RECUPERATION DES SWIMS
  getSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(this.apiUrl);
  }

  // RECUPERATION D'UNE SWIM
  getSeance(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.get(url);
  }

  // AJOUT D'UNE SWIM
  addSeance(fitness: Seance): Observable<any> {
    return this.http.post(this.apiUrl, fitness);
  }

  // MODIFICATION D'UNE SWIM
  updateSeance(id: number, fitness: Seance): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.put(url, fitness);
  }

  // SUPPRESSION D'UNE SWIM
  deleteSeance(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.delete(url);
  }
}