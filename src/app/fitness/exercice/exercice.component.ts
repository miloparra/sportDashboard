import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
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

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  serieFormComponents: any[] = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  newExercice: Exercice = {
    id: 0,
    name_exo: ''
  }

  removeExercice() {
    throw new Error('Method not implemented.');
  }

  addSerie() {
    const factory = this.resolver.resolveComponentFactory(SerieComponent);
    const serieComponentRef = this.container.createComponent(factory);

    // Stocker la référence du composant enfant créé
    this.serieFormComponents.push(serieComponentRef.instance);
    console.log(this.serieFormComponents);
  }

}
