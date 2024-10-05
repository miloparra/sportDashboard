import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BikeService } from './../bike/bike.service';

@Component({
  selector: 'app-modal-edit-ride',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-edit-ride.component.html',
  styleUrl: './modal-edit-ride.component.scss'
})
export class ModalEditRideComponent {
  @Input() modalRide: any;
  @Input() createMode: boolean = true;

  constructor(private bikeService: BikeService) {}

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
