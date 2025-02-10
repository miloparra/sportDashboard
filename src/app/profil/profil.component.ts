import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunService, RunYear } from '../run/run.service';
import { BikeService, RideYear } from '../bike/bike.service';
import { SwimService, SwimYear } from '../swim/swim.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  standalone: true,
  providers: [RunService, BikeService, SwimService],
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {

  constructor(private runService: RunService, private rideService: BikeService, private swimService: SwimService) { }

  runs: RunYear[] = [];
  rides: RideYear[] = [];
  swims: SwimYear[] = [];

  selectedYear = '2025';

  selectedRunYear = {
    distSum: '',
    timeSum: '',
    denivSum: ''
  }

  selectedRideYear = {
    distSum: '',
    timeSum: '',
    denivSum: ''
  }

  selectedSwimYear = {
    distSum: '',
    timeSum: ''
  }

  ngOnInit(): void {
    this.runService.getRunYearTotal().subscribe(runData => {
      this.runs = runData;
      this.rideService.getRideYearTotal().subscribe(rideData => {
        this.rides = rideData;
        this.swimService.getSwimYearTotal().subscribe(swimData => {
          this.swims = swimData;
          this.updateSelectedYearActivities();
        });
      });
    });
  }

  updateSelectedYearActivities() {
    this.selectedRunYear.distSum = this.runs.find(item => item.year == this.selectedYear)?.distSum ?? '0';
    this.selectedRunYear.timeSum = this.runs.find(item => item.year == this.selectedYear)?.timeSum ?? '00:00:00';
    this.selectedRunYear.denivSum = this.runs.find(item => item.year == this.selectedYear)?.denivSum ?? '0';

    this.selectedRideYear.distSum = this.rides.find(item => item.year == this.selectedYear)?.distSum ?? '0';
    this.selectedRideYear.timeSum = this.rides.find(item => item.year == this.selectedYear)?.timeSum ?? '00:00:00';
    this.selectedRideYear.denivSum = this.rides.find(item => item.year == this.selectedYear)?.denivSum ?? '0';

    this.selectedSwimYear.distSum = this.swims.find(item => item.year == this.selectedYear)?.distSum ?? '0';
    this.selectedSwimYear.timeSum = this.swims.find(item => item.year == this.selectedYear)?.timeSum ?? '00:00:00';
  }

}
