import { Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { RunComponent } from './run/run.component';
import { BikeComponent } from './bike/bike.component';
import { SwimComponent } from './swim/swim.component';
import { FitnessComponent } from './fitness/fitness.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, //A l'ouverture de l'app, l'utilisateur est dirige directement sur la page General
    { path: 'general', component: GeneralComponent },
    { path: 'running', component: RunComponent, canActivate: [AuthGuard] },
    { path: 'bike', component: BikeComponent, canActivate: [AuthGuard] },
    { path: 'swim', component: SwimComponent, canActivate: [AuthGuard] },
    { path: 'fitness', component: FitnessComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signin', component: SigninComponent },
];
