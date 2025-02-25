import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwimModalComponent } from './swim-modal/swim-modal.component';
import { SwimService, Swim } from './swim.service';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-swim',
  standalone: true,
  providers: [SwimService],
  imports: [CommonModule, FormsModule, SwimModalComponent, HttpClientModule],
  templateUrl: './swim.component.html',
  styleUrl: './swim.component.scss'
})
export class SwimComponent {

  swims: Swim[] = [];

  constructor(private swimService: SwimService) { }

  createMode = false;

  indexSwimToDelete = 0;

  oldDate = '';
  oldDistance = 0;
  oldCumul = 0;

  editedSwim: Swim = {
    id: 0,
    date_swim: '',
    temps: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    formatted_date_swim: ''
  };

  // AFFICHAGE DES SWIMS
  ngOnInit(): void {
    this.swimService.getSwims().subscribe(data => {
      this.swims = data;
      // Triage par date de la Swim la plus recente a la plus ancienne
      this.swims.sort((a, b) => new Date(b.date_swim).getTime() - new Date(a.date_swim).getTime());
    });
  }

  // REFRESH SWIM TABLE
  refreshTable(): void {
    this.ngOnInit();
  }

  // APPEL DE LA MODAL DE SUPPRESSION
  openDeleteModal(index: number) {
    this.indexSwimToDelete = index;
  }

  // SUPPRESSION D'UNE SWIM
  removeSwim() {
    // Recuperation de l'index de la swim a supprimer
    let index = this.indexSwimToDelete;
    // Recuperation de l'id et de la date de la swim a supprimer
    const supSwimId = this.swims[index].id;
    const supSwimDate = this.swims[index].date_swim;
    // Suppression de la swim en BD
    this.swimService.deleteSwim(supSwimId).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Suppression de la swim de l'affichage local
        this.swims.splice(index, 1);
        // Mettre à jour les cumuls des swims plus recentes après la suppression
        this.updateMoreRecentSwims(supSwimId, supSwimDate);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la swim : ', err);
      }
    });
  }

  // MODIFICATION D'UNE SWIM
  editSwim(swim: Swim) {
    swim.date_swim = swim.date_swim.slice(0, 10);
    this.editedSwim = swim;
    this.oldDate = swim.date_swim;
    this.oldDistance = swim.distance;
    this.oldCumul = swim.cumul;
  }

  onSaveChanges() {
    let cumulDif = this.editedSwim.cumul - this.oldCumul;
    let dateDif = new Date(this.editedSwim.date_swim).getTime() - new Date(this.oldDate).getTime() // Positif si nouvelle date plus recente - Negatif si nouvelle date plus ancienne

    // MISE A JOUR DES CUMULS APRES MODIFICATION D'UNE SWIM
    this.swimService.updateSwim(this.editedSwim.id, this.editedSwim).subscribe({
      next: (response) => {
        console.log('Swim modifiée avec succès', response);
        this.swimService.getSwims().subscribe(data => {
          this.swims = data;
          // Triage par date de la Swim la plus recente a la plus ancienne
          this.swims.sort((a, b) => new Date(b.date_swim).getTime() - new Date(a.date_swim).getTime());

          const updateObservables = this.swims.slice().reverse().map((swim) => {

            // 1. MISE A JOUR DU CUMUL DE LA SWIM QUI A ETE MODIFIEE
            if (swim.id == this.editedSwim.id) {
              if (cumulDif == 0) {
                // Recuperation de l'index de la Swim modifiee
                let editedSwimIndex = this.swims.findIndex(r => r.id === swim.id);
                let previousSwimIndex = editedSwimIndex + 1;
                swim.cumul = +this.swims[previousSwimIndex].cumul + +swim.distance;
              }
            }

            // 2. MISE A JOUR DU CUMUL DE TOUTES LES AUTRES SWIMS
            else {

              // CAS 1 : La nouvelle date est plus recente
              if (dateDif > 0) {
                // Modification des Swim avec une date entre l'ancienne et la nouvelle date de la Swim qui a ete modifiee
                if (new Date(swim.date_swim).getTime() < new Date(this.editedSwim.date_swim).getTime() && new Date(this.oldDate).getTime() < new Date(swim.date_swim).getTime()) {
                  console.log('recente entre')
                  swim.cumul -= +this.oldDistance;
                }
                // Modification des Swim avec une date plus recentes que la nouvelle date de la Swim qui a ete modifiee
                if (new Date(swim.date_swim).getTime() > new Date(this.editedSwim.date_swim).getTime()) {
                  console.log('recente recente')
                  let swimIndex = this.swims.findIndex(r => r.id === swim.id);
                  let prevSwimIndex = swimIndex + 1;
                  swim.cumul = +this.swims[prevSwimIndex].cumul + +swim.distance
                }
              }

              // CAS 2 : La nouvelle date est plus ancienne OU La date n'a pas ete modifiee
              else {
                // Modification des Swim avec une date plus recentes que la date de la Swim qui a ete modifiee
                if (new Date(swim.date_swim).getTime() > new Date(this.editedSwim.date_swim).getTime()) {
                  console.log('ancienne recente')
                  let swimIndex = this.swims.findIndex(r => r.id === swim.id);
                  let prevSwimIndex = swimIndex + 1;
                  swim.cumul = +this.swims[prevSwimIndex].cumul + +swim.distance
                }
              }
            }
            swim.date_swim = swim.date_swim.slice(0, 10);
            // Retourne l'observable de mise a jour
            return this.swimService.updateSwim(swim.id, swim);
          })
          forkJoin(updateObservables).subscribe({
            next: () => {
              console.log('Toutes les swims ont été mises à jour.');
              // REMISE A JOUR DU TABLEAU (Affichage des decimales (.00))
              this.swimService.getSwims().subscribe(data => {
                this.swims = data;
                // Triage par date de la Swim la plus recente a la plus ancienne
                this.swims.sort((a, b) => new Date(b.date_swim).getTime() - new Date(a.date_swim).getTime());
              });
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour des swims', err);
            }
          })
        });
      },
      error: (err) => {
        console.error('Erreur lors de la modification de la swim', err);
      }
    });
  }

  updateMoreRecentSwims(id: number, date: string) {
    // Mettre à jour le tableau après l'ajout ou la suppression
    this.swimService.getSwims().subscribe(data => {
      this.swims = data;
      // Triage par date de la Swim la plus recente a la plus ancienne
      this.swims.sort((a, b) => new Date(b.date_swim).getTime() - new Date(a.date_swim).getTime());
      // MISE A JOUR DES CUMULS APRES AJOUT D'UNE SWIM
      const updateObservables = this.swims.slice().reverse().map((swim) => {
        if (swim.id != id && new Date(swim.date_swim).getTime() > new Date(date).getTime()) {
          let swimIndex = this.swims.findIndex(r => r.id === swim.id);
          let prevSwimIndex = swimIndex + 1;
          if (prevSwimIndex != this.swims.length) {
            swim.cumul = +this.swims[prevSwimIndex].cumul + +swim.distance;
          } else {
            swim.cumul = swim.distance;
          }

        }
        swim.date_swim = swim.date_swim.slice(0, 10);
        return this.swimService.updateSwim(swim.id, swim);
      });
      forkJoin(updateObservables).subscribe({
        next: () => {
          console.log('Toutes les swims ont été mises à jour.');
          // REMISE A JOUR DU TABLEAU (Affichage des decimales (.00))
          this.swimService.getSwims().subscribe(data => {
            this.swims = data;
            // Triage par date de la Swim la plus recente a la plus ancienne
            this.swims.sort((a, b) => new Date(b.date_swim).getTime() - new Date(a.date_swim).getTime());
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des swims', err);
        }
      })
    });
  }
}
