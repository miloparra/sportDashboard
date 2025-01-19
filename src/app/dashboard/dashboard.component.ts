import { Component } from "@angular/core";
import { RunDashboardComponent } from "./run-dashboard/run-dashboard.component";
import { WeekrunDashboardComponent } from "./weekrun-dashboard/weekrun-dashboard.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RunDashboardComponent, WeekrunDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
