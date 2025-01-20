import { Component } from '@angular/core';
import { SwimService, SwimWeek } from '../../swim/swim.service';
import { HttpClientModule } from '@angular/common/http';
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

@Component({
  selector: 'app-weekswim-dashboard',
  standalone: true,
  providers: [SwimService],
  imports: [NgApexchartsModule, HttpClientModule],
  templateUrl: './weekswim-dashboard.component.html',
  styleUrl: './weekswim-dashboard.component.scss'
})
export class WeekswimDashboardComponent {
  public series1: ApexAxisChartSeries | undefined;
  public chart1: ApexChart | undefined;
  public dataLabels1: ApexDataLabels | undefined;
  public stroke1: ApexStroke | undefined;
  public plotOptions1: ApexPlotOptions | undefined;
  public markers1: ApexMarkers | undefined;
  public title1: ApexTitleSubtitle | undefined;
  public fill1: ApexFill | undefined;
  public yaxis1: ApexYAxis | undefined;
  public xaxis1: ApexXAxis | undefined;
  public tooltip1: ApexTooltip | undefined;

  public series2: ApexAxisChartSeries | undefined;
  public chart2: ApexChart | undefined;
  public dataLabels2: ApexDataLabels | undefined;
  public stroke2: ApexStroke | undefined;
  public plotOptions2: ApexPlotOptions | undefined;
  public markers2: ApexMarkers | undefined;
  public title2: ApexTitleSubtitle | undefined;
  public fill2: ApexFill | undefined;
  public yaxis2: ApexYAxis | undefined;
  public xaxis2: ApexXAxis | undefined;
  public tooltip2: ApexTooltip | undefined;

  constructor(private swimService: SwimService) { }

  weekSwims: SwimWeek[] = [];
  yearWeeks: SwimWeek[] = [];

  ngOnInit(): void {
    this.swimService.getSwimWeekTotal().subscribe(data => {
      this.weekSwims = data;
      this.initChartData();
    });
  }

  public initChartData(): void {

    this.weekSwims.sort((a, b) => parseInt(b.week) - parseInt(a.week));

    let lastWeek = this.weekSwims[0].week;
    let firstWeek = this.weekSwims[this.weekSwims.length - 1].week;

    firstWeek = String(firstWeek);
    lastWeek = String(lastWeek);

    this.getYearWeeksBetween(firstWeek, lastWeek);

    console.log(this.yearWeeks);

    this.series1 = [
      {
        name: "Distance",
        data: this.yearWeeks.map(weekData => ({
          x: weekData.week,
          y: weekData.distSum
        }))
      }
    ];
    this.chart1 = {
      id: "chart6",
      type: "line",
      height: 250,
      toolbar: {
        autoSelected: "pan",
        show: false
      }
    };
    this.dataLabels1 = {
      enabled: false
    };
    this.stroke1 = {
      width: 1,
      colors: ["#0000cc"]
    };
    this.markers1 = {
      size: 0
    };
    this.yaxis1 = {
      labels: {
        formatter: function (val) {
          return val.toFixed(0) + " km";
        },
      },
      tickAmount: 3
    };
    this.xaxis1 = {
      type: "category"
    };
    this.tooltip1 = {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(2) + " km";
        }
      }
    };

    this.series2 = [
      {
        name: "Distance",
        data: this.yearWeeks.map(weekData => ({
          x: weekData.week,
          y: weekData.distSum
        }))
      }
    ];
    this.chart2 = {
      id: "chart5",
      type: "area",
      height: 120,
      brush: {
        target: "chart6",
        enabled: true
      },
      selection: {
        enabled: true,
        xaxis: {
          min: this.yearWeeks.indexOf(this.yearWeeks[this.yearWeeks.length - 9]),
          max: this.yearWeeks.indexOf(this.yearWeeks[this.yearWeeks.length - 1]) + 1
        }
      }
    };
    this.dataLabels2 = {
      enabled: false
    };
    this.stroke2 = {
      width: 1,
      colors: ["#0000cc"],
    };
    this.markers2 = {
      size: 0
    };
    this.yaxis2 = {
      labels: {
        formatter: function (val) {
          return val.toFixed(0) + " km";
        }
      },
      tickAmount: 2
    };
    this.xaxis2 = {
      labels: {
        show: false
      },
      type: "category",
    };
  }

  // Recuperation de toutes les semaines entre deux semaines (Format YEARWEEK)
  getYearWeeksBetween(firstWeek: string, lastWeek: string) {
    // Extraire l'année et la semaine de début
    let [startYear, startWeek] = [parseInt(firstWeek.slice(0, 4)), parseInt(firstWeek.slice(4, 6))];
    // Extraire l'année et la semaine de fin
    let [endYear, endWeek] = [parseInt(lastWeek.slice(0, 4)), parseInt(lastWeek.slice(4, 6))];

    let currentYear = startYear;
    let currentWeek = startWeek;

    let indexWeek = 0;

    // Générer les YEARWEEK
    while (currentYear < endYear || (currentYear === endYear && currentWeek <= endWeek)) {

      let yearWeek = `${currentYear}${String(currentWeek).padStart(2, '0')}`;

      // Remplir yearWeeks
      let weekExist = false;
      for (let i = 0; i < this.weekSwims.length; i++) {
        if (this.weekSwims[i].week == yearWeek) {
          weekExist = true;
          this.yearWeeks[indexWeek] = { week: this.getFirstAndLastDayFromYearWeek(yearWeek), yearweek: parseInt(yearWeek), distSum: this.weekSwims[i].distSum, timeSum: this.weekSwims[i].timeSum };
        }
      }
      if (weekExist == false) {
        this.yearWeeks[indexWeek] = { week: this.getFirstAndLastDayFromYearWeek(yearWeek), yearweek: parseInt(yearWeek), distSum: 0, timeSum: 0 };
      }

      // Passer à la semaine suivante
      currentWeek++;

      // Vérifier si on doit passer à l'année suivante
      if (currentWeek > this.getWeeksInYear(currentYear)) {
        currentWeek = 1;
        currentYear++;
      }

      indexWeek++;
    }
  }

  // Fonction pour obtenir le nombre de semaines dans une année (ISO 8601)
  getWeeksInYear(year: number) {
    const lastDayOfYear = new Date(year, 11, 31); // 31 décembre de l'année
    const dayOfWeek = lastDayOfYear.getDay();
    return dayOfWeek === 4 || (dayOfWeek === 3 && this.isLeapYear(year)) ? 53 : 52;
  }

  // Vérifier si une année est bissextile
  isLeapYear(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  // Recuperation du premier et dernier jour d'une semaine (yearWeek -> "DD Mmm YYYY - DD Mmm YYYY")
  getFirstAndLastDayFromYearWeek(yearWeek: string) {
    // Extraire l'année et la semaine
    const year = parseInt(yearWeek.slice(0, 4), 10); // Les 4 premiers caractères
    const week = parseInt(yearWeek.slice(4), 10); // Les caractères suivants

    // Déterminer le premier jour de la semaine
    const firstDayOfYear = new Date(year, 0, 1); // 1er janvier de l'année
    const daysOffset = (week - 1) * 7; // Décalage en jours (semaines * 7 jours)
    const dayOfWeek = firstDayOfYear.getDay(); // Jour de la semaine (0 = Dimanche)
    const diff = (dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8); // Ajuster pour lundi comme premier jour

    const firstDay = new Date(firstDayOfYear);
    firstDay.setDate(firstDay.getDate() - diff + daysOffset); // Premier jour de la semaine

    // Dernier jour de la semaine
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6); // Ajouter 6 jours pour avoir le dimanche

    // Formater les dates
    const optionsWithYear: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const optionsWithoutYear: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };

    let options = (firstDay.getFullYear() == lastDay.getFullYear() ? optionsWithoutYear : optionsWithYear)

    const firstDayFormatted = firstDay.toLocaleDateString('en-GB', options);
    const lastDayFormatted = lastDay.toLocaleDateString('en-GB', optionsWithYear);

    return (firstDayFormatted + ' - ' + lastDayFormatted);
  }
}
