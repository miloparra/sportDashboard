import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Swim, SwimService } from '../swim/swim.service';

@Component({
  selector: 'app-swim-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './swim-modal.component.html',
  styleUrl: './swim-modal.component.scss'
})
export class SwimModalComponent {
  @Input() modalSwim: any;
  @Input() createMode: boolean = true;

  constructor(private swimService: SwimService) {}

  private emptySwim: Swim = {
    id: 0,
    date_swim: '',
    temps: '',
    distance: 0,
    cumul: 0,
    vitesse: 0
  };

  addSwim() {
    // Ajout de la nouvelle swim
    this.swimService.addSwim(this.modalSwim).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la swim : ', err);
      }
    });
    this.modalSwim = { ...this.emptySwim }; // Vide le formulaire après l'ajout
  }

  saveSwim() {
    this.swimService.updateSwim(this.modalSwim.id, this.modalSwim).subscribe({
      next: (response) => {
        window.location.reload();
        console.log('Swim modifiée avec succès', response);
      },
      error: (err) => {
        console.error('Erreur lors de la modification de la swim', err);
      }
    });
  }
}
