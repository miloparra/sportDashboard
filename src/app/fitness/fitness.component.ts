import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExerciceComponent } from './exercice/exercice.component';
import { FitnessService, Seance } from './fitness.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-fitness',
  standalone: true,
  providers:[FitnessService],
  imports: [CommonModule, FormsModule, ExerciceComponent, HttpClientModule],
  templateUrl: './fitness.component.html',
  styleUrl: './fitness.component.scss'
})
export class FitnessComponent {

  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  seances: Seance[] = [];

  exerciceFormComponents: any[] = [];

  constructor(private fitnessService: FitnessService, private resolver: ComponentFactoryResolver) {}

  private emptySeance: Seance = {
    id: 0,
    date_seance: ''
  }

  newSeance: Seance = {
    id: 0,
    date_seance: ''
  }

  // AFFICHAGE DES RUNS
  ngOnInit(): void {
    this.fitnessService.getSeances().subscribe(data => { 
      this.seances = data;
    });
  }

  // AJOUT D'UNE SEANCE
  addSeance() {
    // console.log(this.newSeance.date_seance);
    // this.exerciceFormComponents.forEach((exercice) => {
    //   const series = exercice.serieFormComponents;
    //   console.log(exercice.newExercice.name_exo);
    //   series.forEach((serie: any) => {
    //     console.log(serie.newSerie.nb_repetition);
    //     console.log(serie.newSerie.weight);
    //     console.log(serie.newSerie.type_serie);
    //   })
    // })

    // Ajout d'une nouvelle seance
    this.fitnessService.addSeance(this.newSeance).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response.message);

        // Récupérer l'ID de la nouvelle séance depuis la réponse
        const newSeanceId = response.id;
        console.log('ID de la nouvelle séance : ', newSeanceId);

        // Ajout des exercices et des series
        this.exerciceFormComponents.forEach((exercice) => {

          // Attribution de l'id de la seance a chaque cles etrangeres des exercices
          exercice.newExercice.id_seance = newSeanceId

          // Ajout de chaque exercice
          this.fitnessService.addExercice(exercice.newExercice).subscribe({
            next: (response) => {
              console.log('Réponse du serveur : ', response);
              
              // Récupérer l'ID du nouvel exercice depuis la réponse
              const newExerciceId = response.id;
              console.log('ID du nouvel exercice : ', newExerciceId);

              const series = exercice.serieFormComponents;
              series.forEach((serie: any) => {

                // Attribution de l'id de l'exercice a chaque cles etrangeres des series
                serie.newSerie.id_exercice = newExerciceId

                // Ajout de chaque serie
                this.fitnessService.addSerie(serie.newSerie).subscribe({
                  next: (response) => {
                    console.log('Réponse du serveur : ', response);
                  },
                  error: (err) => {
                    console.error('Erreur lors de l\'ajout de la serie : ', err);
                  }
                });
              })
            },
            error: (err) => {
              console.error('Erreur lors de l\'ajout de l\'exercice : ', err);
            }
          });
        })

        // Mettre à jour le tableau après l'ajout
        this.fitnessService.getSeances().subscribe(data => { 
          this.seances = data;
          console.log(this.seances);
        });

        this.newSeance = { ...this.emptySeance }; // Vide le formulaire après l'ajout
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout d\'une seance : ', err);
      }
    });
  }

  // SUPPRESSION D'UNE SEANCE
  removeSeance(index: number) {
    // Recuperation de l'id de la seance a supprimer
    const id = this.seances[index].id;
    // Suppression de la seance en BD
    this.fitnessService.deleteSeance(id).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Suppression de la seance de l'affichage local
        this.seances.splice(index, 1);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la seance : ', err);
      }
    });
  }

  // MODIFICATION D'UNE SEANCE
  editSeance(seance: Seance) {
    console.log(seance);
  }
  
  // AJOUT D'UN COMPOSANT EXERCICE
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

  // SUPPRESSION D'UN COMPOSANT EXERCICE
  removeExerciceForm(exerciceComponentInstance: any, exerciceComponentRef: any) {
    const index = this.exerciceFormComponents.indexOf(exerciceComponentInstance);
    if (index !== -1) {
      this.exerciceFormComponents.splice(index, 1); // Supprimer de la liste
      exerciceComponentRef.destroy(); // Détruire le composant visuellement
    }
  }

}
