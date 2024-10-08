import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwimModalComponent } from './swim-modal/swim-modal.component';
import { SwimService, Swim } from './swim.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-swim',
  standalone: true,
  providers: [SwimService],
  imports: [CommonModule, FormsModule, SwimModalComponent, HttpClientModule],
  templateUrl: './swim.component.html',
  styleUrl: './swim.component.scss'
})
export class SwimComponent {

  swims: Swim[] = [];

  constructor(private swimService: SwimService) {}

  private emptySwim: Swim = {
    id: 0,
    date_swim: '',
    temps: '',
    distance: 0,
    cumul: 0,
    vitesse: 0
  };

  newSwim: Swim = {
    id: 0,
    date_swim: '',
    temps: '',
    distance: 0,
    cumul: 0,
    vitesse: 0
  };

  editedSwim: Swim = {
    id: 0,
    date_swim: '',
    temps: '',
    distance: 0,
    cumul: 0,
    vitesse: 0
  };

  // AFFICHAGE DES SWIMS
  ngOnInit(): void {
    this.swimService.getSwims().subscribe(data => {
      this.swims = data;
    });
  }

  // AJOUT D'UNE SWIM
  addSwim(): void {
    // Ajout d'un nouveau swim
    this.swimService.addSwim(this.newSwim).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Mettre à jour le tableau après l'ajout
        this.swimService.getSwims().subscribe(data => { 
          this.swims = data;
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la swim : ', err);
      }
    });
    this.newSwim = { ...this.emptySwim }; // Vide le formulaire après l'ajout
  }

  // SUPPRESSION D'UNE SWIM
  removeSwim(index: number) {
    // Recuperation de l'id de la swim a supprimer
    const id = this.swims[index].id;
    // Suppression de la swim en BD
    this.swimService.deleteSwim(id).subscribe({
      next: (response) => {
        console.log('Réponse du serveur : ', response);
        // Suppression de la swim de l'affichage local
        this.swims.splice(index, 1);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la swim : ', err);
      }
    });
  }

  // MODIFICATION D'UNE SWIM
  editSwim(swim: Swim) {
    swim.date_swim = swim.date_swim.slice(0, 10);
    this.editedSwim = swim;
  }
}
