import { Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { RunningComponent } from './running/running.component';
import { BikeComponent } from './bike/bike.component';

export const routes: Routes = [
    {path: '', redirectTo: '/general', pathMatch: 'full'}, //A l'ouverture de l'app, l'utilisateur est dirige directement sur la page General
    {path: 'general', component: GeneralComponent},
    {path: 'running', component: RunningComponent},
    {path: 'bike', component: BikeComponent},
];
