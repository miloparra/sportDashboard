import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RunModalComponent } from './run-modal/run-modal.component';
import { RunService, Run } from './run.service';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { minKmSpeedCalculator } from './../utils/utils';

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

  constructor(private runService: RunService) { }

  createMode = false;

  indexRunToDelete = 0;

  oldDate = '';
  oldDistance = 0;
  oldCumul = 0;

  editedRun: Run = {
    id: 0,
    date_run: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    denivele: 0,
    temps: '',
    formatted_date_run: ''
  };

  // AFFICHAGE DES RUNS
  ngOnInit(): void {
    this.runService.getRuns().subscribe(data => {
      this.runs = data;
      // Triage par date de la Run la plus recente a la plus ancienne
      this.runs.sort((a, b) => new Date(b.date_run).getTime() - new Date(a.date_run).getTime());
    });
  }

  // AJOUT D'UN RUN
  onAddNewRun(): void {
    // Ajout d'un nouveau run
    if (this.editedRun.temps == '' || this.editedRun.distance == 0) {
      this.editedRun.vitesse = 0;
    } else {
      this.editedRun.vitesse = minKmSpeedCalculator(this.editedRun.temps, this.editedRun.distance);
    }
    this.runService.addRun(this.editedRun).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Mettre à jour les cumuls des runs plus recentes après l'ajout
        this.updateMoreRecentRuns(this.editedRun.id, this.editedRun.date_run);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du run : ', err);
      }
    });
  }

  // APPEL DE LA MODAL DE SUPPRESSION
  openDeleteModal(index: number) {
    this.indexRunToDelete = index;
  }

  // SUPPRESSION D'UN RUN
  removeRun() {
    // Recuperation de l'index du run a supprimer
    let index = this.indexRunToDelete;
    // Recuperation de l'id et la date du run a supprimer
    const supRunId = this.runs[index].id;
    const supRunDate = this.runs[index].date_run;
    // Suppression du run en BD
    this.runService.deleteRun(supRunId).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Suppression du run de l'affichage local
        this.runs.splice(index, 1);
        // Mettre à jour les cumuls des runs plus recentes après la suppression
        this.updateMoreRecentRuns(supRunId, supRunDate);
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
    this.oldDate = run.date_run;
    this.oldDistance = run.distance;
    this.oldCumul = run.cumul;
  }

  onSaveChanges() {
    let cumulDif = this.editedRun.cumul - this.oldCumul;
    let dateDif = new Date(this.editedRun.date_run).getTime() - new Date(this.oldDate).getTime() // Positif si nouvelle date plus recente - Negatif si nouvelle date plus ancienne

    // MISE A JOUR DES CUMULS APRES MODIFICATION D'UNE RUN
    this.runService.updateRun(this.editedRun.id, this.editedRun).subscribe({
      next: (response) => {
        console.log('Run modifiée avec succès', response);
        this.runService.getRuns().subscribe(data => {
          this.runs = data;
          // Triage par date de la Run la plus recente a la plus ancienne
          this.runs.sort((a, b) => new Date(b.date_run).getTime() - new Date(a.date_run).getTime());

          const updateObservables = this.runs.slice().reverse().map((run) => {

            // 1. MISE A JOUR DU CUMUL DE LA RUN QUI A ETE MODIFIEE
            if (run.id == this.editedRun.id) {
              if (cumulDif == 0) {
                // Recuperation de l'index de la Run modifiee
                let editedRunIndex = this.runs.findIndex(r => r.id === run.id);
                let previousRunIndex = editedRunIndex + 1;
                run.cumul = +this.runs[previousRunIndex].cumul + +run.distance;
              }
            }

            // 2. MISE A JOUR DU CUMUL DE TOUTES LES AUTRES RUNS
            else {

              // CAS 1 : La nouvelle date est plus recente
              if (dateDif > 0) {
                // Modification des Run avec une date entre l'ancienne et la nouvelle date de la Run qui a ete modifiee
                if (new Date(run.date_run).getTime() < new Date(this.editedRun.date_run).getTime() && new Date(this.oldDate).getTime() < new Date(run.date_run).getTime()) {
                  console.log('recente entre')
                  run.cumul -= +this.oldDistance;
                }
                // Modification des Run avec une date plus recentes que la nouvelle date de la Run qui a ete modifiee
                if (new Date(run.date_run).getTime() > new Date(this.editedRun.date_run).getTime()) {
                  console.log('recente recente')
                  let runIndex = this.runs.findIndex(r => r.id === run.id);
                  let prevRunIndex = runIndex + 1;
                  run.cumul = +this.runs[prevRunIndex].cumul + +run.distance
                }
              }

              // CAS 2 : La nouvelle date est plus ancienne OU La date n'a pas ete modifiee
              else {
                // Modification des Run avec une date plus recentes que la date de la Run qui a ete modifiee
                if (new Date(run.date_run).getTime() > new Date(this.editedRun.date_run).getTime()) {
                  console.log('ancienne recente')
                  let runIndex = this.runs.findIndex(r => r.id === run.id);
                  let prevRunIndex = runIndex + 1;
                  run.cumul = +this.runs[prevRunIndex].cumul + +run.distance
                }
              }
            }
            run.date_run = run.date_run.slice(0, 10);
            // Retourne l'observable de mise a jour
            return this.runService.updateRun(run.id, run);
          })
          forkJoin(updateObservables).subscribe({
            next: () => {
              console.log('Toutes les runs ont été mises à jour.');
              // REMISE A JOUR DU TABLEAU (Affichage des decimales (.00))
              this.runService.getRuns().subscribe(data => {
                this.runs = data;
                // Triage par date de la Run la plus recente a la plus ancienne
                this.runs.sort((a, b) => new Date(b.date_run).getTime() - new Date(a.date_run).getTime());
              });
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour des runs', err);
            }
          })
        });
      },
      error: (err) => {
        console.error('Erreur lors de la modification de la run', err);
      }
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
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des runs', err);
        }
      })
    });
  }

}
