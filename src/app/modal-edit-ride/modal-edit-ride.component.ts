import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit-ride',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-edit-ride.component.html',
  styleUrl: './modal-edit-ride.component.scss'
})
export class ModalEditRideComponent {
  @Input() ride: any;

  saveRide() {
    console.log('Modifications enregistrées pour la sortie :', this.ride);
  }
}
