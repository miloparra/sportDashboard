import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalEditRideComponent } from '../modal-edit-ride/modal-edit-ride.component';

export interface Ride {
  date: string;
  dist: number;
  cumulCoureur: number;
  cumulVelo: number;
  deniv: number;
  temps: number;
  parcours: string;
}

@Component({
  selector: 'app-bike',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalEditRideComponent],
  templateUrl: './bike.component.html',
  styleUrl: './bike.component.scss'
})
export class BikeComponent {

  outings: Ride[] = [];

  private emptyRide: Ride = {
    date: '',
    dist: 0,
    cumulCoureur: 0,
    cumulVelo: 0,
    deniv: 0,
    temps: 0,
    parcours: ''
  };

  newRide: Ride = {
    date: '',
    dist: 0,
    cumulCoureur: 0,
    cumulVelo: 0,
    deniv: 0,
    temps: 0,
    parcours: ''
  };

  // Fonction pour ajouter une ride
  addRide(): void {
      this.outings.push({ ...this.newRide }); // Ajout de la nouvelle sortie au tableau
      this.newRide = { ...this.emptyRide }; // Vide le formulaire après l'ajout
  }

  // Fonction pour supprimer une ride
  removeRide(index: number) {
    this.outings.splice(index, 1);
  }

  selectedRide: any;

  // Fonction pour modifier unr ride
  editRide(index: number) {
    this.selectedRide = this.outings[index];
  }
}
