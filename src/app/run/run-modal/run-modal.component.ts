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

  @Output() addNewRun = new EventEmitter<void>(); // Événement pour ajouter une nouvelle run
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
    this.addNewRun.emit();
    this.modalRun = { ...this.emptyRun }; // Vide le formulaire après l'ajout
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
}
