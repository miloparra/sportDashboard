import { Component } from "@angular/core";
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";
import { Run, RunService } from "../../run/run.service";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-run-dashboard',
  standalone: true,
  providers: [RunService],
  imports: [NgApexchartsModule, HttpClientModule],
  templateUrl: './run-dashboard.component.html',
  styleUrl: './run-dashboard.component.scss'
})
export class RunDashboardComponent {
  public series: ApexAxisChartSeries | undefined;
  public chart: ApexChart | undefined;
  public dataLabels: ApexDataLabels | undefined;
  public stroke: ApexStroke | undefined;
  public plotOptions: ApexPlotOptions | undefined;
  public markers: ApexMarkers | undefined;
  public title: ApexTitleSubtitle | undefined;
  public fill: ApexFill | undefined;
  public yaxis: ApexYAxis | undefined;
  public xaxis: ApexXAxis | undefined;
  public tooltip: ApexTooltip | undefined;


  constructor(private runService: RunService) {}

  runs: Run[] = [];

  ngOnInit(): void {
    this.runService.getRuns().subscribe(data => { 
      this.runs = data;
      this.initChartData();
    });
  }

  public initChartData(): void {
    let runsToDisplay = [];

    for (let i = 0; i < this.runs.length; i++) {
      const date = new Date(this.runs[i].date_run).getTime();  // Convertir la date en timestamp
      const dist = this.runs[i].distance;

      runsToDisplay.push([date, dist]);
    }

    console.log(runsToDisplay);


    this.series = [
      {
        name: "Distance",
        data: runsToDisplay
      }
    ];
    this.chart = {
      type: "line",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.stroke = {
      width: 1
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "Evolution des distances parcourues",
      align: "left"
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return val.toFixed(2);
        }
      },
      title: {
        text: "Km"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return val.toFixed(2) + " km";
        }
      }
    };
  }
}
