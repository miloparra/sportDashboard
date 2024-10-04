import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BikeService } from './../bike/bike.service';

@Component({
  selector: 'app-modal-edit-ride',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-edit-ride.component.html',
  styleUrl: './modal-edit-ride.component.scss'
})
export class ModalEditRideComponent {
  @Input() rideToEdit: any;

  constructor(private bikeService: BikeService) {}

  saveRide() {
    this.bikeService.updateRide(this.rideToEdit.id, this.rideToEdit).subscribe({
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
