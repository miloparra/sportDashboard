import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExerciceComponent } from './exercice/exercice.component';
import { FitnessService, SeanceLinked, Seance } from './fitness.service';
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

  constructor(private fitnessService: FitnessService, private resolver: ComponentFactoryResolver) {}

  seancesLinked: SeanceLinked[] = [];

  exerciceComponents: any[] = [];

  exerciceComponentRefs: any[] = [];

  exerciceComponentsToDeleteFromEdit: any[] = [];

  createMode: boolean = true;

  indexSeanceToDelete = 0;

  private emptySeance: Seance = {
    id: 0,
    date_seance: ''
  }

  newSeance: Seance = {
    id: 0,
    date_seance: ''
  }

  seanceToEdit: SeanceLinked = {
    seance_id: 0,
    date_seance: '',
    exercices: []
  }

  // AFFICHAGE DES RUNS
  ngOnInit(): void {
    this.fitnessService.getSeancesLinked().subscribe(data => { 
      this.seancesLinked = data;
      console.log(this.seancesLinked)
    });
  }

  // AJOUT D'UNE SEANCE
  addSeance() {
    
    // Ajout d'une nouvelle seance
    this.fitnessService.addSeance(this.newSeance).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response.message);

        // Récupérer l'ID de la nouvelle séance depuis la réponse
        const newSeanceId = response.id;
        console.log('ID de la nouvelle séance : ', newSeanceId);

        // Ajout des exercices et des series
        this.exerciceComponents.forEach((exercice) => {

          // Attribution de l'id de la seance a chaque cles etrangeres des exercices
          exercice.newExercice.id_seance = newSeanceId

          // Ajout de chaque exercice
          this.fitnessService.addExercice(exercice.newExercice).subscribe({
            next: (response) => {
              console.log('Réponse du serveur : ', response);
              
              // Récupérer l'ID du nouvel exercice depuis la réponse
              const newExerciceId = response.id;
              console.log('ID du nouvel exercice : ', newExerciceId);

              const series = exercice.serieComponents;
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

        // Mettre à jour le tableau SEANCE avec leurs LIENS après l'ajout
        this.fitnessService.getSeancesLinked().subscribe(data => { 
          this.seancesLinked = data;
        });

        // Suppression des composants apres ajout de la seance
        this.exerciceComponents.length = 0;
        this.exerciceComponentRefs.forEach((exercice) => {
          exercice.destroy();
        })

        this.newSeance = { ...this.emptySeance }; // Vide le formulaire après l'ajout
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout d\'une seance : ', err);
      }
    });
  }

  // APPEL DE LA MODAL DE SUPPRESSION
  openDeleteModal(index: number) {
    this.indexSeanceToDelete = index;
  }

  // SUPPRESSION D'UNE SEANCE
  async removeSeance() {

    // Recuperation de l'index de la seance a supprimer
    let index = this.indexSeanceToDelete;

    // Recuperation de l'id de la seance a supprimer
    const seanceId = this.seancesLinked[index].seance_id;

    try {
      // Boucle sur les exercices de la séance
      for (const exercice of this.seancesLinked[index].exercices) {
        // Boucle sur les séries de chaque exercice
        for (const serie of exercice.series) {
          // Suppression de la série en base de données
          await this.fitnessService.deleteSerie(serie.serie_id).toPromise();
          console.log('Série supprimée avec succès');
        }
  
        // Suppression de l'exercice en base de données une fois toutes les séries supprimées
        await this.fitnessService.deleteExercice(exercice.exercice_id).toPromise();
        console.log('Exercice supprimé avec succès');
      }
  
      // Suppression de la séance en base de données une fois tous les exercices supprimés
      await this.fitnessService.deleteSeance(seanceId).toPromise();
      console.log('Séance supprimée avec succès');

      // Suppression de la séance de l'affichage local
      this.seancesLinked.splice(index, 1);
  
    } catch (err) {
      console.error('Erreur lors de la suppression : ', err);
    }

  }

  // MODIFICATION D'UNE SEANCE
  editSeance(seance: SeanceLinked) {
    // Afficher la date dans le formulaire
    seance.date_seance = seance.date_seance.slice(0, 10);
    this.newSeance.date_seance = seance.date_seance;

    // Afficher les data des exercices et series dans le formulaire
    let exerciceComponentIndex = 0;
    seance.exercices.forEach((exercice) => {
      this.addExerciceComponent();
      this.exerciceComponents[exerciceComponentIndex].newExercice.id = exercice.exercice_id;
      this.exerciceComponents[exerciceComponentIndex].newExercice.name_exo = exercice.name;
      this.exerciceComponents[exerciceComponentIndex].newExercice.id_seance = exercice.id_seance;
      let serieComponentIndex = 0;
      exercice.series.forEach((serie) => {
        this.exerciceComponents[exerciceComponentIndex].addSerieComponent()
        this.exerciceComponents[exerciceComponentIndex].serieComponents[serieComponentIndex].newSerie.id = serie.serie_id;
        this.exerciceComponents[exerciceComponentIndex].serieComponents[serieComponentIndex].newSerie.nb_serie = serie.nb_serie;
        this.exerciceComponents[exerciceComponentIndex].serieComponents[serieComponentIndex].newSerie.nb_repetition = serie.nb_repetition;
        this.exerciceComponents[exerciceComponentIndex].serieComponents[serieComponentIndex].newSerie.weight = serie.weight;
        this.exerciceComponents[exerciceComponentIndex].serieComponents[serieComponentIndex].newSerie.type_serie = serie.type;
        this.exerciceComponents[exerciceComponentIndex].serieComponents[serieComponentIndex].newSerie.id_exercice = serie.id_exercice;
        serieComponentIndex++;
      })
      exerciceComponentIndex++;
    })

    // Allimenter la seance a modifier (juste pour modifier la seance sans les exercices et series)
    this.seanceToEdit = seance;

    // Switch en mode edition
    this.createMode = false;

    console.log(this.exerciceComponents);
  }

  saveChanges() {

    // Switch en mode creation
    this.createMode = true;

    // Recuperation de la seance a modifier (juste pour modifier la seance sans les exercices et series)
    let seance = this.seanceToEdit;
    seance.date_seance = this.newSeance.date_seance;
    
    // Récupérer l'ID de la séance a modifier
    const seanceId = seance.seance_id

    // Modification de la seance
    this.fitnessService.updateSeance(seanceId, seance).subscribe({
      next: (response) => {
        console.log('Seance modifiée avec succès', response);
        this.exerciceComponents.forEach((exercice) => {
          if (exercice.newExercice.id != 0) {
            // CAS OU L'EXERCICE EXISTE :
            // Modification de chaque exercice
            this.fitnessService.updateExercice(exercice.newExercice.id, exercice.newExercice).subscribe({
              next: (response) => {
                console.log('Exercice modifiée avec succès', response);
                exercice.serieComponents.forEach((serie: any) => {
                  if (serie.newSerie.id != 0) {
                    // CAS OU LA SERIE EXISTE :
                    // Modification de chaque serie
                    this.fitnessService.updateSerie(serie.newSerie.id, serie.newSerie).subscribe({
                      next: (response) => {
                        console.log('Serie modifiée avec succès', response);
                      },
                      error: (err) => {
                        console.error('Erreur lors de la modification de la serie', err);
                      }
                    });
                  } else {
                    // CAS OU LA SERIE A ETE AJOUTEE :
                    // Attribution de l'id de l'exercice a chaque cles etrangeres des serie
                    serie.newSerie.id_exercice = exercice.newExercice.id
                    // Ajout de chaque serie
                    this.fitnessService.addSerie(serie.newSerie).subscribe({
                      next: (response) => {
                        console.log('Réponse du serveur : ', response);
                      },
                      error: (err) => {
                        console.error('Erreur lors de l\'ajout de la serie : ', err);
                      }
                    });
                  }
                })
              },
              error: (err) => {
                console.error('Erreur lors de la modification de l\'exercice', err);
              }
            });
          } else {
            // CAS OU L'EXERCICE A ETE AJOUTE :
            // Attribution de l'id de la seance a chaque cles etrangeres des exercices
            exercice.newExercice.id_seance = seanceId
            // Ajout de chaque exercice
            this.fitnessService.addExercice(exercice.newExercice).subscribe({
              next: (response) => {
                console.log('Réponse du serveur : ', response);
                // Récupérer l'ID du nouvel exercice depuis la réponse
                const newExerciceId = response.id;
                const series = exercice.serieComponents;
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
          }
        })

        // Suppression des exercices et series supprimes pendant la modification
        this.exerciceComponents.forEach((exercice) => {
          exercice.serieComponentsToDeleteFromEdit.forEach((serie: { newSerie: { id: any; }; }) => {
            this.fitnessService.deleteSerie(serie.newSerie.id).subscribe({
              next: (response) => {
                console.log('Réponse du serveur : ', response);
              },
              error: (err) => {
                console.error('Erreur lors de la suppression de la serie : ', err);
              }
            });
          })
        })
        this.exerciceComponentsToDeleteFromEdit.forEach((exercice) => {
          let i = 0;
          console.log(exercice.serieComponents.length)
          exercice.serieComponents.forEach((serie: { newSerie: { id: number; }; }) => {
            i++;
            this.fitnessService.deleteSerie(serie.newSerie.id).subscribe({
              next: (response) => {
                console.log('Réponse du serveur : ', response);
                if (i == exercice.serieComponents.length) {
                  this.fitnessService.deleteExercice(exercice.newExercice.id).subscribe({
                    next: (response) => {
                      console.log('Réponse du serveur : ', response);
                    },
                    error: (err) => {
                      console.error('Erreur lors de la suppression de l\'exercice : ', err);
                    }
                  });
                }
              },
              error: (err) => {
                console.error('Erreur lors de la suppression de la serie : ', err);
              }
            });
          })
          
        })

        // Suppression des composants apres ajout de la seance
        this.exerciceComponents.length = 0;
        this.exerciceComponentRefs.forEach((exercice) => {
          exercice.destroy();
        })

        this.newSeance = { ...this.emptySeance }; // Vide le formulaire après l'ajout

        window.location.reload(); // Recharger la page
      },
      error: (err) => {
        console.error('Erreur lors de la modification de la seance', err);
      }
    });
  }
  
  // AJOUT D'UN COMPOSANT EXERCICE
  addExerciceComponent() {
    const factory = this.resolver.resolveComponentFactory(ExerciceComponent);
    const exerciceComponentRef = this.container.createComponent(factory);

    // Stocker la référence du composant enfant créé
    this.exerciceComponents.push(exerciceComponentRef.instance);
    this.exerciceComponentRefs.push(exerciceComponentRef);

    // Ecouter l'événement `removeRequest` du composant Exercice
    exerciceComponentRef.instance.removeExerciceRequest.subscribe(() => {
      this.removeExerciceComponent(exerciceComponentRef.instance, exerciceComponentRef);
    });
  }

  // SUPPRESSION D'UN COMPOSANT EXERCICE
  removeExerciceComponent(exerciceComponentInstance: any, exerciceComponentRef: any) {
    const index = this.exerciceComponents.indexOf(exerciceComponentInstance);
    if (index !== -1) {
      this.exerciceComponents.splice(index, 1); // Supprimer de la liste
      exerciceComponentRef.destroy(); // Détruire le composant visuellement
    }
    // Edit : Stocker les composants Exercices a supprimer lors d'une modification d'une seance
    this.exerciceComponentsToDeleteFromEdit.push(exerciceComponentInstance);
  }

}
