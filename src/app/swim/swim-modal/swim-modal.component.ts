import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Swim, SwimService } from '../swim.service';

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

  @Output() saveChanges = new EventEmitter<void>(); // Événement pour mettre a jour le tableau des Swims

  constructor(private swimService: SwimService) { }

  private emptySwim: Swim = {
    id: 0,
    date_swim: '',
    temps: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    formatted_date_swim: ''
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
    this.saveChanges.emit();
  }
}
