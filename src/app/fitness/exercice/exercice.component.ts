import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SerieComponent } from './serie/serie.component';
import { Exercice } from '../fitness.service';

@Component({
  selector: 'app-exercice',
  standalone: true,
  imports: [FormsModule, SerieComponent],
  templateUrl: './exercice.component.html',
  styleUrl: './exercice.component.scss'
})
export class ExerciceComponent {
  @Output() removeRequest = new EventEmitter<void>(); // Événement pour signaler la suppression

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  serieComponents: any[] = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  newExercice: Exercice = {
    id: 0,
    name_exo: '',
    id_seance: 0
  }

  removeExerciceComponent() {
    this.removeRequest.emit(); // Emet l'événement vers le parent
  }

  addSerieComponent() {
    const factory = this.resolver.resolveComponentFactory(SerieComponent);
    const serieComponentRef = this.container.createComponent(factory);

    // Stocker la référence du composant enfant créé
    this.serieComponents.push(serieComponentRef.instance);
    console.log(this.serieComponents);

    // Ecouter l'événement `removeRequest` du composant Exercice
    serieComponentRef.instance.removeRequest.subscribe(() => {
      this.removeSerieComponent(serieComponentRef.instance, serieComponentRef);
    });
  }

  // Méthode pour supprimer un composant Exercice
  removeSerieComponent(exerciceComponentInstance: any, exerciceComponentRef: any) {
    const index = this.serieComponents.indexOf(exerciceComponentInstance);
    if (index !== -1) {
      this.serieComponents.splice(index, 1); // Supprimer de la liste
      exerciceComponentRef.destroy(); // Détruire le composant visuellement
    }
  }

}
