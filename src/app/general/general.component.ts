import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RunModalComponent } from '../run/run-modal/run-modal.component';
import { BikeModalComponent } from '../bike/bike-modal/bike-modal.component';
import { SwimModalComponent } from '../swim/swim-modal/swim-modal.component';
import { RunService, Run } from '../run/run.service';
import { BikeService, Ride } from './../bike/bike.service';
import { SwimService, Swim } from '../swim/swim.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bike',
  standalone: true,
  providers: [RunService, BikeService, SwimService],
  imports: [CommonModule, FormsModule, RunModalComponent, BikeModalComponent, SwimModalComponent, HttpClientModule, RouterLink],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {

  constructor(private bikeService: BikeService) { }

  newRun: Run = {
    id: 0,
    date_run: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    denivele: 0,
    temps: '',
    formatted_date_run: ''
  }

  newRide: Ride = {
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

  newSwim: Swim = {
    id: 0,
    date_swim: '',
    temps: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    formatted_date_swim: ''
  }

}
