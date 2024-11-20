import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Run, RunService } from '../run.service';

@Component({
  selector: 'app-run-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './run-modal.component.html',
  styleUrl: './run-modal.component.scss'
})
export class RunModalComponent {
  @Input() modalRun: any;
  @Input() createMode: boolean = true;

  @Output() saveChanges = new EventEmitter<void>(); // Événement pour mettre a jour le tableau de Runs

  constructor(private runService: RunService) { }

  private emptyRun: Run = {
    id: 0,
    date_run: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    denivele: 0,
    temps: '',
    formatted_date_run: ''
  };

  addRun() {
    // Ajout de la nouvelle run
    this.runService.addRun(this.modalRun).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la run : ', err);
      }
    });
    this.modalRun = { ...this.emptyRun }; // Vide le formulaire après l'ajout
  }

  saveRun() {
    this.saveChanges.emit();
  }
}
