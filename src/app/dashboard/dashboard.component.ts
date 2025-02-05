import { Component } from "@angular/core";
import { RunDashboardComponent } from "./run-dashboard/run-dashboard.component";
import { WeekrunDashboardComponent } from "./weekrun-dashboard/weekrun-dashboard.component";
import { WeekrideDashboardComponent } from "./weekride-dashboard/weekride-dashboard.component";
import { WeekswimDashboardComponent } from "./weekswim-dashboard/weekswim-dashboard.component";
import { ActivitiesDonutComponent } from "./activities-donut/activities-donut.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WeekrunDashboardComponent, WeekrideDashboardComponent, WeekswimDashboardComponent, ActivitiesDonutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
