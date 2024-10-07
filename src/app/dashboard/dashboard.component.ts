import { Component } from "@angular/core";
import { RunDashboardComponent } from "./run-dashboard/run-dashboard.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RunDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
}
