import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BikeService, Ride } from '../bike/bike.service';

@Component({
  selector: 'app-bike-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bike-modal.component.html',
  styleUrl: './bike-modal.component.scss'
})
export class BikeModalComponent {
  @Input() modalRide: any;
  @Input() createMode: boolean = true;

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

  addRide() {
    // Ajout de la nouvelle ride
    this.bikeService.addRide(this.modalRide).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la ride : ', err);
      }
    });
    this.modalRide = { ...this.emptyRide }; // Vide le formulaire après l'ajout
  }

  saveRide() {
    this.bikeService.updateRide(this.modalRide.id, this.modalRide).subscribe({
      next: (response) => {
        window.location.reload();
        console.log('Ride modifiée avec succès', response);
      },
      error: (err) => {
        console.error('Erreur lors de la modification de la ride', err);
      }
    });
  }
}
