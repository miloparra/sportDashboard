import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-bike',
  standalone: true,
  providers: [],
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {
  addSportDay() {
    console.log('ajout d\'une nouvelle journee');
  }
}
