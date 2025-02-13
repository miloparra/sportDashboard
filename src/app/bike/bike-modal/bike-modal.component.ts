import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BikeService, Ride } from '../bike.service';

@Component({
  selector: 'app-bike-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bike-modal.component.html',
  styleUrl: './bike-modal.component.scss'
})
export class BikeModalComponent {
  @Input() modalRide: any;
  @Input() createMode: boolean = true;

  @Output() addNewRide = new EventEmitter<void>(); // Événement pour ajouter une nouvelle ride
  @Output() saveChanges = new EventEmitter<void>(); // Événement pour mettre a jour le tableau de Rides

  constructor(private bikeService: BikeService) { }

  outings: Ride[] = [];

  private emptyRide: Ride = {
    id: 0,
    date_ride: '',
    distance: 0,
    cumul_coureur: 0,
    cumul_velo: 0,
    denivele: 0,
    temps: '',
    parcours: '',
    formatted_date_ride: ''
  };

  ngOnInit(): void {
    this.bikeService.getOutings().subscribe(data => {
      this.outings = data;
      // Triage par date de la Ride la plus recente a la plus ancienne
      this.outings.sort((a, b) => new Date(b.date_ride).getTime() - new Date(a.date_ride).getTime());
    });
  }

  addRide() {
    this.addNewRide.emit();
    this.modalRide = { ...this.emptyRide }; // Vide le formulaire après l'ajout
  }

  saveRide() {
    this.saveChanges.emit();
    this.modalRide = { ...this.emptyRide }; // Vide le formulaire après la modif
  }

  cumulCalcul() {
    console.log(this.outings)
    let prevRideFind = false
    if (this.outings.length == 0) {
      this.modalRide.cumul_coureur = this.modalRide.distance;
      this.modalRide.cumul_velo = this.modalRide.distance;
    } else {
      this.outings.forEach((ride) => {
        if (new Date(ride.date_ride).getTime() <= new Date(this.modalRide.date_ride).getTime() && prevRideFind == false) {
          let lastCumulCoureur = +ride.cumul_coureur + +this.modalRide.distance;
          this.modalRide.cumul_coureur = lastCumulCoureur;
          let lastCumulVelo = +ride.cumul_velo + +this.modalRide.distance;
          this.modalRide.cumul_velo = lastCumulVelo;
          prevRideFind = true
        }
      })
      if (prevRideFind == false) {
        this.modalRide.cumul_coureur = this.modalRide.distance;
        this.modalRide.cumul_velo = this.modalRide.distance;
      }
    }
  }

  cancelModification() {
    this.bikeService.getOutings().subscribe(data => {
      this.outings = data;
      this.modalRide = { ...this.emptyRide }; // Vide le formulaire après l'annulation
    });
  }
}
