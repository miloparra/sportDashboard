import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Serie } from '../../fitness.service';

@Component({
  selector: 'app-serie',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './serie.component.html',
  styleUrl: './serie.component.scss'
})
export class SerieComponent {
  @Output() removeRequest = new EventEmitter<void>(); // Événement pour signaler la suppression

  newSerie: Serie = {
    id: 0,
    nb_serie: 0,
    nb_repetition: 0,
    weight: 0,
    type_serie: '',
    id_exercice: 0
  }

  removeSerieComponent() {
    this.removeRequest.emit(); // Emet l'événement vers le parent
  }

}
