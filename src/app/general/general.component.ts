import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RunModalComponent } from '../run-modal/run-modal.component';
import { BikeModalComponent } from '../bike-modal/bike-modal.component';
import { RunService, Run } from '../run/run.service';
import { BikeService, Ride } from './../bike/bike.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-bike',
  standalone: true,
  providers: [RunService, BikeService],
  imports: [CommonModule, FormsModule, RunModalComponent, BikeModalComponent, HttpClientModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {

  constructor(private bikeService: BikeService) {}

  newRun: Run = {
    id: 0,
    date_run: '',
    distance: 0,
    cumul: 0,
    vitesse: 0,
    denivele: 0,
    temps: ''
  }

  newRide: Ride = {
    id: 0,
    date_sortie: '',
    distance: 0,
    cumul_coureur: 0,
    cumul_velo: 0,
    denivele: 0,
    temps: '',
    parcours: ''
  }
  
}
