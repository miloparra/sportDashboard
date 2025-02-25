import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  constructor(private authService: AuthService) { }

  email = '';
  password = '';
  firstname = '';
  lastname = '';
  base64Image: string = ''; // Stocke l’image convertie

  // 🔹 Convertir l’image en Base64
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convertir en Base64
      reader.onload = () => {
        this.compressImage(reader.result as string);
      };
    }
  }

  // 🔹 Compression de l'image avec un Canvas
  compressImage(base64Str: string, maxWidth = 300, maxHeight = 300) {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Redimensionnement proportionnel
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx!.drawImage(img, 0, 0, width, height);

      // Convertir en Base64 avec qualité réduite
      this.base64Image = canvas.toDataURL('image/jpeg', 0.7); // 70% qualité
    };
  }

  signin() {
    this.authService.register(this.email, this.password, this.firstname, this.lastname, this.base64Image);
  }

}
