import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Swim, SwimService } from '../swim.service';
import { kmHrSpeedCalculator } from '../../utils/utils';
import { forkJoin } from 'rxjs';

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

  @Output() refreshSwimPage = new EventEmitter<void>(); // Événement pour ajouter une nouvelle ride
  @Output() saveChanges = new EventEmitter<void>(); // Événement pour mettre a jour le tableau des Swims

  constructor(private swimService: SwimService) { }

  swims: Swim[] = [];

  private emptySwim: Swim = {
    id: 0,
    date_swim: '',
    temps: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    formatted_date_swim: ''
  };

  ngOnInit(): void {
    this.swimService.getSwims().subscribe(data => {
      this.swims = data;
      // Triage par date de la Swim la plus recente a la plus ancienne
      this.swims.sort((a, b) => new Date(b.date_swim).getTime() - new Date(a.date_swim).getTime());
    });
  }

  addSwim() {
    // Ajout d'un nouveau swim
    this.modalSwim.vitesse = kmHrSpeedCalculator(this.modalSwim.temps, this.modalSwim.distance);
    this.swimService.addSwim(this.modalSwim).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Mettre à jour les cumuls des swims plus recentes après l'ajout
        this.updateMoreRecentSwims(this.modalSwim.id, this.modalSwim.date_swim);
        // Vide le formulaire après l'ajout
        this.modalSwim = { ...this.emptySwim };
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la swim : ', err);
      }
    });
  }

  saveSwim() {
    this.saveChanges.emit();
    this.modalSwim = { ...this.emptySwim }; // Vide le formulaire après la modif
  }

  cumulCalcul() {
    this.swimService.getSwims().subscribe(data => {
      this.swims = data;
      // Triage par date de la Swim la plus recente a la plus ancienne
      this.swims.sort((a, b) => new Date(b.date_swim).getTime() - new Date(a.date_swim).getTime());

      let prevSwimFind = false
      if (this.swims.length == 0) {
        this.modalSwim.cumul = this.modalSwim.distance;
      } else {
        this.swims.forEach((swim) => {
          if (new Date(swim.date_swim).getTime() <= new Date(this.modalSwim.date_swim).getTime() && prevSwimFind == false) {
            let lastCumul = +swim.cumul + +this.modalSwim.distance;
            this.modalSwim.cumul = lastCumul;
            prevSwimFind = true
          }
        })
        if (prevSwimFind == false) {
          this.modalSwim.cumul = this.modalSwim.distance;
        }
      }

    });
  }

  cancelModification() {
    this.swimService.getSwims().subscribe(data => {
      this.swims = data;
      this.modalSwim = { ...this.emptySwim }; // Vide le formulaire après l'annulation
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
            // Reload swim component
            this.refreshSwimPage.emit();
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des swims', err);
        }
      })
    });
  }

}
