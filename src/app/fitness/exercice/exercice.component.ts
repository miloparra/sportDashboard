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

  serieFormComponents: any[] = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  newExercice: Exercice = {
    id: 0,
    name_exo: ''
  }

  removeExercice() {
    this.removeRequest.emit(); // Emet l'événement vers le parent
  }

  addSerie() {
    const factory = this.resolver.resolveComponentFactory(SerieComponent);
    const serieComponentRef = this.container.createComponent(factory);

    // Stocker la référence du composant enfant créé
    this.serieFormComponents.push(serieComponentRef.instance);
    console.log(this.serieFormComponents);

    // Ecouter l'événement `removeRequest` du composant Exercice
    serieComponentRef.instance.removeRequest.subscribe(() => {
      this.removeSerieForm(serieComponentRef.instance, serieComponentRef);
    });
  }

  // Méthode pour supprimer un composant Exercice
  removeSerieForm(exerciceComponentInstance: any, exerciceComponentRef: any) {
    const index = this.serieFormComponents.indexOf(exerciceComponentInstance);
    if (index !== -1) {
      this.serieFormComponents.splice(index, 1); // Supprimer de la liste
      exerciceComponentRef.destroy(); // Détruire le composant visuellement
    }
  }

}
