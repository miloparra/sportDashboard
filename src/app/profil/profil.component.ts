import { Component } from '@angular/core';
import { RunService, RunYear } from '../run/run.service';
import { BikeService, RideYear } from '../bike/bike.service';
import { SwimService, SwimYear } from '../swim/swim.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  standalone: true,
  providers: [RunService, BikeService, SwimService],
  imports: [HttpClientModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {

  constructor(private runService: RunService, private rideService: BikeService, private swimService: SwimService) { }

  runs: RunYear[] = [];
  rides: RideYear[] = [];
  swims: SwimYear[] = [];

  selectedYear = 2;

  ngOnInit(): void {
    this.runService.getRunYearTotal().subscribe(runData => {
      this.runs = runData;
      console.log(this.runs)
    });
  }
}
