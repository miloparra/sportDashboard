import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RunService } from '../run/run.service';

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

  constructor(private runService: RunService) {}

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
  }

  saveRun() {
    this.runService.updateRun(this.modalRun.id, this.modalRun).subscribe({
      next: (response) => {
        window.location.reload();
        console.log('Run modifiée avec succès', response);
      },
      error: (err) => {
        console.error('Erreur lors de la modification de la run', err);
      }
    });
  }
}
