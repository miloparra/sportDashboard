import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalEditRideComponent } from '../modal-edit-ride/modal-edit-ride.component';

export interface Run {
  date: string;
  dist: number;
  cumul: number;
  vitesse: number;
  deniv: number;
  temps: number;
  parcours: string;
}

@Component({
  selector: 'app-running',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalEditRideComponent],
  templateUrl: './running.component.html',
  styleUrl: './running.component.scss'
})
export class RunningComponent {

  outings: Run[] = [];

  private emptyRun: Run = {
    date: '',
    dist: 0,
    cumul: 0,
    vitesse: 0,
    deniv: 0,
    temps: 0,
    parcours: ''
  };

  newRun: Run = {
    date: '',
    dist: 0,
    cumul: 0,
    vitesse: 0,
    deniv: 0,
    temps: 0,
    parcours: ''
  };

  // Fonction pour ajouter une ride
  addRun(): void {
      this.outings.push({ ...this.newRun }); // Ajout de la nouvelle sortie au tableau
      this.newRun = { ...this.emptyRun }; // Vide le formulaire après l'ajout
  }

  // Fonction pour supprimer une ride
  removeRun(index: number) {
    this.outings.splice(index, 1);
  }

  selectedRun: any;

  // Fonction pour modifier unr ride
  editRun(index: number) {
    this.selectedRun = this.outings[index];
  }
}
