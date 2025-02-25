import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Run, RunService } from '../run.service';
import { minKmSpeedCalculator } from '../../utils/utils';
import { forkJoin } from 'rxjs';

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

  @Output() refreshRunTable = new EventEmitter<void>(); // Événement pour ajouter une nouvelle run
  @Output() saveChanges = new EventEmitter<void>(); // Événement pour mettre a jour le tableau de Runs

  constructor(private runService: RunService) { }

  runs: Run[] = [];

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

  ngOnInit(): void {
    this.runService.getRuns().subscribe(data => {
      this.runs = data;
      // Triage par date de la Run la plus recente a la plus ancienne
      this.runs.sort((a, b) => new Date(b.date_run).getTime() - new Date(a.date_run).getTime());
    });
  }

  addRun() {
    // Ajout d'un nouveau run
    if (this.modalRun.temps == '' || this.modalRun.distance == 0) {
      this.modalRun.vitesse = 0;
    } else {
      this.modalRun.vitesse = minKmSpeedCalculator(this.modalRun.temps, this.modalRun.distance);
    }
    this.runService.addRun(this.modalRun).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Mettre à jour les cumuls des runs plus recentes après l'ajout
        this.updateMoreRecentRuns(this.modalRun.id, this.modalRun.date_run);
        // Vide le formulaire après l'ajout
        this.modalRun = { ...this.emptyRun };
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du run : ', err);
      }
    });
  }

  saveRun() {
    this.saveChanges.emit();
    this.modalRun = { ...this.emptyRun }; // Vide le formulaire après la modif
  }

  cumulCalcul() {
    this.runService.getRuns().subscribe(data => {
      this.runs = data;
      // Triage par date de la Run la plus recente a la plus ancienne
      this.runs.sort((a, b) => new Date(b.date_run).getTime() - new Date(a.date_run).getTime());

      let prevRunFind = false
      if (this.runs.length == 0) {
        this.modalRun.cumul = this.modalRun.distance;
      } else {
        this.runs.forEach((run) => {
          if (new Date(run.date_run).getTime() <= new Date(this.modalRun.date_run).getTime() && prevRunFind == false) {
            let lastCumul = +run.cumul + +this.modalRun.distance;
            this.modalRun.cumul = lastCumul;
            prevRunFind = true
          }
        })
        if (prevRunFind == false) {
          this.modalRun.cumul = this.modalRun.distance;
        }
      }

    });
  }

  cancelModification() {
    this.runService.getRuns().subscribe(data => {
      this.runs = data;
      this.modalRun = { ...this.emptyRun }; // Vide le formulaire après l'annulation
    });
  }

  updateMoreRecentRuns(id: number, date: string) {
    // Mettre à jour le tableau après l'ajout ou la supression
    this.runService.getRuns().subscribe(data => {
      this.runs = data;
      // Triage par date de la Run la plus recente a la plus ancienne
      this.runs.sort((a, b) => new Date(b.date_run).getTime() - new Date(a.date_run).getTime());
      // MISE A JOUR DES CUMULS APRES AJOUT OU SUPPRESSION D'UNE RUN
      const updateObservables = this.runs.slice().reverse().map((run) => {
        if (run.id != id && new Date(run.date_run).getTime() > new Date(date).getTime()) {
          let runIndex = this.runs.findIndex(r => r.id === run.id);
          let prevRunIndex = runIndex + 1;
          if (prevRunIndex != this.runs.length) {
            run.cumul = +this.runs[prevRunIndex].cumul + +run.distance;
          } else {
            run.cumul = run.distance;
          }
        }
        run.date_run = run.date_run.slice(0, 10);
        // Retourne l'observable de mise a jour
        return this.runService.updateRun(run.id, run);
      });
      forkJoin(updateObservables).subscribe({
        next: () => {
          console.log('Toutes les runs ont été mises à jour.');
          // REMISE A JOUR DU TABLEAU (Affichage des decimales (.00))
          this.runService.getRuns().subscribe(data => {
            this.runs = data;
            // Triage par date de la Run la plus recente a la plus ancienne
            this.runs.sort((a, b) => new Date(b.date_run).getTime() - new Date(a.date_run).getTime());
            // Refresh run table
            this.refreshRunTable.emit();
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des runs', err);
        }
      })
    });
  }
}
