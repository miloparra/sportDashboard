import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SeanceLinked {
  seance_id: number;
  date: string;
  exercices: ExerciceLinked[]
}

export interface ExerciceLinked {
  exercice_id: number;
  name: string;
  id_seance: number;
  series: SerieLinked[]
}

export interface SerieLinked {
  serie_id: number;
  nb_serie: number;
  nb_repetition: number;
  weight: number;
  type: string;
  id_exercice: number
}

export interface Seance {
  id: number;
  date_seance: string
}

export interface Exercice {
  id: number;
  name_exo: string;
  id_seance: number
}

export interface Serie {
  id: number;
  nb_serie: number;
  nb_repetition: number;
  weight: number;
  type_serie: string;
  id_exercice: number
}

@Injectable({
  providedIn: 'root',
})
export class FitnessService {
  private apiUrlSeanceLinked = 'http://localhost:3000/api/seanceslinked';
  private apiUrlSeance = 'http://localhost:3000/api/seances';
  private apiUrlExercice = 'http://localhost:3000/api/exercices';
  private apiUrlSerie = 'http://localhost:3000/api/series';

  constructor(private http: HttpClient) {}

//_______________________________________________________
//________________________SEANCE_________________________

  // RECUPERATION DES SEANCES ET LEURS LIENS
  getSeancesLinked(): Observable<[]> {
    return this.http.get<[]>(this.apiUrlSeanceLinked);
  }

  // RECUPERATION DES SEANCES
  getSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(this.apiUrlSeance);
  }

  // RECUPERATION D'UNE SEANCE
  getSeance(id: number): Observable<any> {
    const url = `${this.apiUrlSeance}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.get(url);
  }

  // AJOUT D'UNE SEANCE
  addSeance(seance: Seance): Observable<any> {
    return this.http.post(this.apiUrlSeance, seance);
  }

  // MODIFICATION D'UNE SEANCE
  updateSeance(id: number, seance: SeanceLinked): Observable<any> {
    const url = `${this.apiUrlSeance}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.put(url, seance);
  }

  // SUPPRESSION D'UNE SEANCE
  deleteSeance(id: number): Observable<any> {
    const url = `${this.apiUrlSeance}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.delete(url);
  }

//_______________________________________________________
//________________________EXERCICE_______________________

  // RECUPERATION DES EXERCICES
  getExercices(): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(this.apiUrlExercice);
  }

  // RECUPERATION D'UN EXERCICE
  getExercice(id: number): Observable<any> {
    const url = `${this.apiUrlExercice}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.get(url);
  }

  // AJOUT D'UN EXERCICE
  addExercice(exercice: Exercice): Observable<any> {
    return this.http.post(this.apiUrlExercice, exercice);
  }

  // MODIFICATION D'UN EXERCICE
  updateExercice(id: number, exercice: Exercice): Observable<any> {
    const url = `${this.apiUrlExercice}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.put(url, exercice);
  }

  // SUPPRESSION D'UN EXERCICE
  deleteExercice(id: number): Observable<any> {
    const url = `${this.apiUrlExercice}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.delete(url);
  }
//______________________________________________________
//________________________SERIE_________________________

  // RECUPERATION DES SERIES
  getSeries(): Observable<Serie[]> {
    return this.http.get<Serie[]>(this.apiUrlSerie);
  }

  // RECUPERATION D'UNE SERIE
  getSerie(id: number): Observable<any> {
    const url = `${this.apiUrlSerie}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.get(url);
  }

  // AJOUT D'UNE SERIE
  addSerie(seance: Serie): Observable<any> {
    return this.http.post(this.apiUrlSerie, seance);
  }

  // MODIFICATION D'UNE SERIE
  updateSerie(id: number, serie: Serie): Observable<any> {
    const url = `${this.apiUrlSerie}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.put(url, serie);
  }

  // SUPPRESSION D'UNE SERIE
  deleteSerie(id: number): Observable<any> {
    const url = `${this.apiUrlSerie}/${id}`; // Construction de l'URL avec l'identifiant
    return this.http.delete(url);
  }

}