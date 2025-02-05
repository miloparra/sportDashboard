import { Component } from '@angular/core';
import {
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexPlotOptions
} from "ng-apexcharts";
import { Run, RunService, RunYear } from '../../run/run.service';
import { BikeService, Ride, RideYear } from '../../bike/bike.service';
import { Swim, SwimService, SwimYear } from '../../swim/swim.service';
// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-activities-donut',
  standalone: true,
  providers: [RunService, BikeService, SwimService],
  imports: [NgApexchartsModule],
  templateUrl: './activities-donut.component.html',
  styleUrl: './activities-donut.component.scss'
})
export class ActivitiesDonutComponent {
  public series: ApexNonAxisChartSeries | undefined;
  public chart: ApexChart | undefined;
  public responsive: ApexResponsive[] | undefined;
  public labels: any;
  public colors: string[] | undefined;
  public plotOptions: ApexPlotOptions | undefined

  constructor(private runService: RunService, private rideService: BikeService, private swimService: SwimService) { }

  runs: RunYear[] = [];
  rides: Ride[] = [];
  swims: SwimYear[] = [];

  ngOnInit(): void {
    this.runService.getRunYearTotal().subscribe(runData => {
      this.runs = runData;
      this.initChartData();
    });
  }

  public initChartData(): void {

    const years = this.runs.map(run => run.year);
    const distances = this.runs.map(run => parseFloat(run.distSum));

    this.series = distances;
    this.chart = {
      type: "donut",
      width: 300
    };
    this.colors = ["#0000cc", "#E91E63", "#9C27B0"];
    this.labels = years;
    this.plotOptions = {
      pie: {
        donut: {
          size: "45%"
        }
      }
    };
    this.responsive = [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  }
}