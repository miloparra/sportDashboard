import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BikeModalComponent } from './bike-modal/bike-modal.component';
import { BikeService, Ride } from './bike.service';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bike',
  standalone: true,
  providers: [BikeService],
  imports: [CommonModule, FormsModule, BikeModalComponent, HttpClientModule],
  templateUrl: './bike.component.html',
  styleUrl: './bike.component.scss'
})
export class BikeComponent {

  outings: Ride[] = [];

  constructor(private bikeService: BikeService) { }

  createMode = false;

  indexRideToDelete = 0;

  oldDate = '';
  oldDistance = 0;
  oldCumulCoureur = 0;
  oldCumulVelo = 0;

  editedRide: Ride = {
    id: 0,
    date_ride: '',
    distance: 0,
    cumul_coureur: 0,
    cumul_velo: 0,
    denivele: 0,
    temps: '',
    parcours: '',
    formatted_date_ride: ''
  }

  // AFFICHAGE DES RIDES
  ngOnInit(): void {
    this.bikeService.getOutings().subscribe(data => {
      this.outings = data;
      // Triage par date de la Ride la plus recente a la plus ancienne
      this.outings.sort((a, b) => new Date(b.date_ride).getTime() - new Date(a.date_ride).getTime());
    });
  }

  // REFRESH RIDE TABLE
  refreshTable(): void {
    this.ngOnInit();
  }

  // APPEL DE LA MODAL DE SUPPRESSION
  openDeleteModal(index: number) {
    this.indexRideToDelete = index;
  }

  // SUPPRESSION D'UNE RIDE
  removeRide() {
    // Recuperation de l'index de la ride a supprimer
    let index = this.indexRideToDelete;
    // Recuperation de l'id et de la date de la ride a supprimer
    const supRideId = this.outings[index].id;
    const supRideDate = this.outings[index].date_ride;
    // Suppression de la ride en BD
    this.bikeService.deleteRide(supRideId).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Suppression de la ride de l'affichage local
        this.outings.splice(index, 1);
        // Mettre à jour les cumuls des rides plus recentes après la suppression
        this.updateMoreRecentRides(supRideId, supRideDate);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la ride : ', err);
      }
    });
  }

  // MODIFICATION D'UNE RIDE
  editRide(ride: Ride) {
    ride.date_ride = ride.date_ride.slice(0, 10);
    this.editedRide = ride;
    this.oldDate = ride.date_ride;
    this.oldDistance = ride.distance;
    this.oldCumulCoureur = ride.cumul_coureur;
    this.oldCumulVelo = ride.cumul_velo;
  }

  onSaveChanges() {
    let cumulCoureurDif = this.editedRide.cumul_coureur - this.oldCumulCoureur;
    let cumulVeloDif = this.editedRide.cumul_velo - this.oldCumulVelo;
    let dateDif = new Date(this.editedRide.date_ride).getTime() - new Date(this.oldDate).getTime() // Positif si nouvelle date plus recente - Negatif si nouvelle date plus ancienne

    // MISE A JOUR DES CUMULS APRES MODIFICATION D'UNE RIDE
    this.bikeService.updateRide(this.editedRide.id, this.editedRide).subscribe({
      next: (response) => {
        console.log('Ride modifiée avec succès', response);
        this.bikeService.getOutings().subscribe(data => {
          this.outings = data;
          // Triage par date de la Ride la plus recente a la plus ancienne
          this.outings.sort((a, b) => new Date(b.date_ride).getTime() - new Date(a.date_ride).getTime());

          const updateObservables = this.outings.slice().reverse().map((ride) => {

            // 1. MISE A JOUR DU CUMUL DE LA RIDE QUI A ETE MODIFIEE
            if (ride.id == this.editedRide.id) {
              if (cumulCoureurDif == 0) {
                // Recuperation de l'index de la Ride modifiee
                let editedRideIndex = this.outings.findIndex(r => r.id === ride.id);
                let previousRideIndex = editedRideIndex + 1;
                ride.cumul_coureur = +this.outings[previousRideIndex].cumul_coureur + +ride.distance;
              }
              if (cumulVeloDif == 0) {
                // Recuperation de l'index de la Ride modifiee
                let editedRideIndex = this.outings.findIndex(r => r.id === ride.id);
                let previousRideIndex = editedRideIndex + 1;
                ride.cumul_velo = +this.outings[previousRideIndex].cumul_velo + +ride.distance;
              }
            }

            // 2. MISE A JOUR DU CUMUL DE TOUTES LES AUTRES RIDES
            else {

              // CAS 1 : La nouvelle date est plus recente
              if (dateDif > 0) {
                // Modification des Ride avec une date entre l'ancienne et la nouvelle date de la Ride qui a ete modifiee
                if (new Date(ride.date_ride).getTime() < new Date(this.editedRide.date_ride).getTime() && new Date(this.oldDate).getTime() < new Date(ride.date_ride).getTime()) {
                  console.log('recente entre')
                  ride.cumul_coureur -= +this.oldDistance;
                  ride.cumul_velo -= +this.oldDistance;
                }
                // Modification des Ride avec une date plus recentes que la nouvelle date de la Ride qui a ete modifiee
                if (new Date(ride.date_ride).getTime() > new Date(this.editedRide.date_ride).getTime()) {
                  console.log('recente rencente')
                  let rideIndex = this.outings.findIndex(r => r.id === ride.id);
                  let prevRideIndex = rideIndex + 1;
                  ride.cumul_coureur = +this.outings[prevRideIndex].cumul_coureur + +ride.distance
                  ride.cumul_velo = +this.outings[prevRideIndex].cumul_velo + +ride.distance
                }
              }

              // CAS 2 : La nouvelle date est plus ancienne OU La date n'a pas ete modifiee
              else {
                // Modification des Ride avec une date plus recentes que la date de la Ride qui a ete modifiee
                if (new Date(ride.date_ride).getTime() > new Date(this.editedRide.date_ride).getTime()) {
                  console.log('ancienne recente')
                  let rideIndex = this.outings.findIndex(r => r.id === ride.id);
                  let prevRideIndex = rideIndex + 1;
                  ride.cumul_coureur = +this.outings[prevRideIndex].cumul_coureur + +ride.distance
                  ride.cumul_velo = +this.outings[prevRideIndex].cumul_velo + +ride.distance
                }
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
              });
            },
            error: (err) => {
              console.error('Erreur lors de la mise à jour des rides', err);
            }
          })
        });
      },
      error: (err) => {
        console.error('Erreur lors de la modification de la ride', err);
      }
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
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des rides', err);
        }
      })
    });
  }
}
