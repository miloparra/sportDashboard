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
  @Output() removeExerciceRequest = new EventEmitter<void>(); // Événement pour signaler la suppression

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  serieComponents: any[] = [];

  serieComponentsToDeleteFromEdit: any[] = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  newExercice: Exercice = {
    id: 0,
    name_exo: '',
    id_seance: 0
  }

  removeExerciceComponent() {
    this.removeExerciceRequest.emit(); // Emet l'événement vers le parent
  }

  addSerieComponent() {
    const factory = this.resolver.resolveComponentFactory(SerieComponent);
    const serieComponentRef = this.container.createComponent(factory);

    // Stocker la référence du composant enfant créé
    this.serieComponents.push(serieComponentRef.instance);

    // Ecouter l'événement `removeRequest` du composant Serie
    serieComponentRef.instance.removeSerieRequest.subscribe(() => {
      this.removeSerieComponent(serieComponentRef.instance, serieComponentRef);
    });
  }

  // Méthode pour supprimer un composant Serie
  removeSerieComponent(serieComponentInstance: any, serieComponentRef: any) {
    const index = this.serieComponents.indexOf(serieComponentInstance);
    if (index !== -1) {
      this.serieComponents.splice(index, 1); // Supprimer de la liste
      serieComponentRef.destroy(); // Détruire le composant visuellement
    }
    // Edit : Stocker les composants Serie a supprimer lors d'une modification d'une seance
    this.serieComponentsToDeleteFromEdit.push(serieComponentInstance);
  }

}
