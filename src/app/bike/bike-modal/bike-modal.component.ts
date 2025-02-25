import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BikeService, Ride } from '../bike.service';
import { forkJoin } from 'rxjs';

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

  @Output() refreshRideTable = new EventEmitter<void>(); // Événement pour ajouter une nouvelle ride
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
    // Ajout de la nouvelle ride
    this.bikeService.addRide(this.modalRide).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Mettre à jour les cumuls des rides plus recentes après l'ajout
        this.updateMoreRecentRides(this.modalRide.id, this.modalRide.date_ride);
        // Vide le formulaire après l'ajout
        this.modalRide = { ...this.emptyRide };
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la ride : ', err);
      }
    });
  }

  saveRide() {
    this.saveChanges.emit();
    this.modalRide = { ...this.emptyRide }; // Vide le formulaire après la modif
  }

  cumulCalcul() {
    this.bikeService.getOutings().subscribe(data => {
      this.outings = data;
      // Triage par date de la Ride la plus recente a la plus ancienne
      this.outings.sort((a, b) => new Date(b.date_ride).getTime() - new Date(a.date_ride).getTime());

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

    });
  }

  cancelModification() {
    this.bikeService.getOutings().subscribe(data => {
      this.outings = data;
      this.modalRide = { ...this.emptyRide }; // Vide le formulaire après l'annulation
    });
  }

  updateMoreRecentRides(id: number, date: string) {
    // Mettre à jour le tableau après l'ajout ou la supression
    this.bikeService.getOutings().subscribe(data => {
      this.outings = data;
      // Triage par date de la Ride la plus recente a la plus ancienne
      this.outings.sort((a, b) => new Date(b.date_ride).getTime() - new Date(a.date_ride).getTime());
      // MISE A JOUR DES CUMULS APRES AJOUT D'UNE RIDE
      const updateObservables = this.outings.slice().reverse().map((ride) => {
        if (ride.id != id && new Date(ride.date_ride).getTime() > new Date(date).getTime()) {
          let rideIndex = this.outings.findIndex(r => r.id === ride.id);
          let prevRideIndex = rideIndex + 1;
          if (prevRideIndex != this.outings.length) {
            ride.cumul_coureur = +this.outings[prevRideIndex].cumul_coureur + +ride.distance;
            ride.cumul_velo = +this.outings[prevRideIndex].cumul_velo + +ride.distance;
          } else {
            ride.cumul_coureur = ride.distance;
            ride.cumul_velo = ride.distance;
          }
        }
        ride.date_ride = ride.date_ride.slice(0, 10);
        return this.bikeService.updateRide(ride.id, ride);
      })
      forkJoin(updateObservables).subscribe({
        next: () => {
          console.log('Toutes les rides ont été mises à jour.');
          // REMISE A JOUR DU TABLEAU (Affichage des decimales (.00))
          this.bikeService.getOutings().subscribe(data => {
            this.outings = data;
            // Triage par date de la Ride la plus recente a la plus ancienne
            this.outings.sort((a, b) => new Date(b.date_ride).getTime() - new Date(a.date_ride).getTime());
            // Refresh ride table
            this.refreshRideTable.emit();
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des rides', err);
        }
      })
    });
  }
}
