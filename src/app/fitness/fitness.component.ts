import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciceComponent } from './exercice/exercice.component';
import { FitnessService, Seance, Exercice, Serie } from './fitness.service';

@Component({
  selector: 'app-fitness',
  standalone: true,
  providers:[FitnessService],
  imports: [FormsModule, ExerciceComponent],
  templateUrl: './fitness.component.html',
  styleUrl: './fitness.component.scss'
})
export class FitnessComponent {

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  exerciceFormComponents: any[] = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  newSeance: Seance = {
    id: 0,
    date_fitness: ''
  }

  addSeance() {
    this.exerciceFormComponents.forEach((exercice) => {
      const series = exercice.serieFormComponents;
      console.log(exercice.newExercice.name_exo);
      series.forEach((serie: any) => {
        console.log(serie.newSerie.nb_repetition)
        console.log(serie.newSerie.weight)
        console.log(serie.newSerie.type_serie)
      })
    })
  }
  
  addExercice() {
    const factory = this.resolver.resolveComponentFactory(ExerciceComponent);
    const exerciceComponentRef = this.container.createComponent(factory);

    // Stocker la référence du composant enfant créé
    this.exerciceFormComponents.push(exerciceComponentRef.instance);
    console.log(this.exerciceFormComponents);

    // Ecouter l'événement `removeRequest` du composant Exercice
    exerciceComponentRef.instance.removeRequest.subscribe(() => {
      this.removeExerciceForm(exerciceComponentRef.instance, exerciceComponentRef);
    });
  }

  // Méthode pour supprimer un composant Exercice
  removeExerciceForm(exerciceComponentInstance: any, exerciceComponentRef: any) {
    const index = this.exerciceFormComponents.indexOf(exerciceComponentInstance);
    if (index !== -1) {
      this.exerciceFormComponents.splice(index, 1); // Supprimer de la liste
      exerciceComponentRef.destroy(); // Détruire le composant visuellement
    }
  }

}
