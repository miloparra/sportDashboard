import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BikeModalComponent } from '../bike-modal/bike-modal.component';
import { BikeService, Ride } from './../bike/bike.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-bike',
  standalone: true,
  providers: [BikeService],
  imports: [CommonModule, FormsModule, BikeModalComponent, HttpClientModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {

  constructor(private bikeService: BikeService) {}

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
