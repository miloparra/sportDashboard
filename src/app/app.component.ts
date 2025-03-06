import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  showProfil = false;
  user: any;

  constructor(public authService: AuthService, private router: Router) {
    this.user = authService.getUser();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const protectedRoutes = ['/running', '/bike', '/swim', '/fitness', '/dashboard'];
        this.showProfil = protectedRoutes.includes(event.url);
      }
    });
  }

  isLoginPage(): boolean {
    return ['/login'].includes(this.router.url);
  }

  isSigninPage(): boolean {
    return ['/signin'].includes(this.router.url);
  }

  isAuthPage(): boolean {
    return ['/login', '/signin'].includes(this.router.url);
  }

  logout() {
    this.authService.logout();
  }

  openApp() {
    window.open('http://localhost:8080', '_blank', 'width=600,height=550');
  }
}
