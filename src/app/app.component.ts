import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProfilComponent } from "./profil/profil.component";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [AuthService],
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ProfilComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sportdashboard';

  constructor(public authService: AuthService) { }

  openApp() {
    window.open('http://localhost:8080', '_blank', 'width=600,height=550');
  }

  logout() {
    this.authService.logout();
  }
}
