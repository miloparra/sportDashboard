import { Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { RunComponent } from './run/run.component';
import { BikeComponent } from './bike/bike.component';
import { SwimComponent } from './swim/swim.component';
import { FitnessComponent } from './fitness/fitness.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {path: '', redirectTo: '/general', pathMatch: 'full'}, //A l'ouverture de l'app, l'utilisateur est dirige directement sur la page General
    {path: 'general', component: GeneralComponent},
    {path: 'running', component: RunComponent},
    {path: 'bike', component: BikeComponent},
    {path: 'swim', component: SwimComponent},
    {path: 'fitness', component: FitnessComponent},
    {path: 'dashboard', component: DashboardComponent},
];
