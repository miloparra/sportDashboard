import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GeneralComponent } from "./general/general.component";
import { RunningComponent } from "./running/running.component";
import { BikeComponent } from './bike/bike.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, GeneralComponent, RunningComponent, BikeComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sportdashboard';

  openApp() {
    window.open('http://localhost:8080', '_blank', 'width=600,height=550');
  }
}
