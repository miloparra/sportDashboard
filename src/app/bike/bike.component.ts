import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BikeModalComponent } from '../bike-modal/bike-modal.component';
import { BikeService, Ride } from './bike.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-bike',
  standalone: true,
  providers: [BikeService],
  imports: [CommonModule, FormsModule, BikeModalComponent, HttpClientModule],
  templateUrl: './bike.component.html',
  styleUrl: './bike.component.scss'
})
export class BikeComponent {

  outings: Ride[] = [];

  constructor(private bikeService: BikeService) {}

  private emptyRide: Ride = {
    id: 0,
    date_sortie: '',
    distance: 0,
    cumul_coureur: 0,
    cumul_velo: 0,
    denivele: 0,
    temps: '',
    parcours: ''
  };

  newRide: Ride = {
    id: 0,
    date_sortie: '',
    distance: 0,
    cumul_coureur: 0,
    cumul_velo: 0,
    denivele: 0,
    temps: '',
    parcours: ''
  };

  editedRide: Ride = {
    id: 0,
    date_sortie: '',
    distance: 0,
    cumul_coureur: 0,
    cumul_velo: 0,
    denivele: 0,
    temps: '',
    parcours: ''
  }

  // AFFICHAGE DES RIDES
  ngOnInit(): void {
    this.bikeService.getOutings().subscribe(data => {
      this.outings = data;
    });
  }

  // AJOUT D'UNE RIDE
  addRide(): void {
    // Ajout de la nouvelle ride
    this.bikeService.addRide(this.newRide).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Mettre à jour le tableau après l'ajout
        this.bikeService.getOutings().subscribe(data => { 
          this.outings = data;
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la ride : ', err);
      }
    });
    this.newRide = { ...this.emptyRide }; // Vide le formulaire après l'ajout
  }

  // SUPPRESSION D'UNE RIDE
  removeRide(index: number) {
    // Recuperation de l'id de la ride a supprimer
    const id = this.outings[index].id;
    // Suppression de la ride en BD
    this.bikeService.deleteRide(id).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Suppression de la ride de l'affichage local
        this.outings.splice(index, 1);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la sortie : ', err);
      }
    });
  }

  // MODIFICATION D'UNE RIDE
  editRide(ride: Ride) {
    ride.date_sortie = ride.date_sortie.slice(0, 10);
    this.editedRide = ride;
  }
}
