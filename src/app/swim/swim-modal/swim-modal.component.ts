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

  @Output() addNewSwim = new EventEmitter<void>(); // Événement pour ajouter une nouvelle ride
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
    this.addNewSwim.emit();
    this.modalSwim = { ...this.emptySwim }; // Vide le formulaire après l'ajout
  }

  saveSwim() {
    this.saveChanges.emit();
    this.modalSwim = { ...this.emptySwim }; // Vide le formulaire après la modif
  }

  cumulCalcul() {
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
  }

  cancelModification() {
    this.swimService.getSwims().subscribe(data => {
      this.swims = data;
      this.modalSwim = { ...this.emptySwim }; // Vide le formulaire après l'annulation
    });
  }
}
