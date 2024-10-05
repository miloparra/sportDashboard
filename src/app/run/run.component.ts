import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RunModalComponent } from '../run-modal/run-modal.component';
import { RunService, Run } from './run.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-run',
  standalone: true,
  providers: [RunService],
  imports: [CommonModule, FormsModule, RunModalComponent, HttpClientModule],
  templateUrl: './run.component.html',
  styleUrl: './run.component.scss'
})
export class RunComponent {

  runs: Run[] = [];

  constructor(private runService: RunService) {}

  private emptyRun: Run = {
    id: 0,
    date_run: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    denivele: 0,
    temps: ''
  };

  newRun: Run = {
    id: 0,
    date_run: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    denivele: 0,
    temps: ''
  };

  editedRun: Run = {
    id: 0,
    date_run: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    denivele: 0,
    temps: ''
  };

  // AFFICHAGE DES RUNS
  ngOnInit(): void {
    this.runService.getRuns().subscribe(data => {
      this.runs = data;
    });
  }

  // AJOUT D'UN RUN
  addRun(): void {
    // Ajout d'un nouveau run
    this.runService.addRun(this.newRun).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Mettre à jour le tableau après l'ajout
        this.runService.getRuns().subscribe(data => { 
          this.runs = data;
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du run : ', err);
      }
    });
    this.newRun = { ...this.emptyRun }; // Vide le formulaire après l'ajout
  }

  // SUPPRESSION D'UN RUN
  removeRun(index: number) {
    // Recuperation de l'id du run a supprimer
    const id = this.runs[index].id;
    // Suppression du run en BD
    this.runService.deleteRun(id).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Suppression du run de l'affichage local
        this.runs.splice(index, 1);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du run : ', err);
      }
    });
  }

  // MODIFICATION D'UN RUN
  editRun(run: Run) {
    run.date_run = run.date_run.slice(0, 10);
    this.editedRun = run;
  }
}
