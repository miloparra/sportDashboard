import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private userSubject = new BehaviorSubject<any>(null);
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.loadUser();
    }

    private loadUser() {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded: any = jwtDecode(token);
            this.userSubject.next(decoded);
        }
    }

    register(email: string, password: string) {
        const url = `${this.apiUrl}/register`;
        return this.http.post(url, { email, password }).subscribe({
            next: (res) => console.log("✅ Réponse reçue :", res),
            error: (err) => console.error("❌ Erreur lors de l'inscription :", err)
        });
    }

    login(email: string, password: string) {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
            .subscribe({
                next: (response) => {
                    localStorage.setItem('token', response.token);
                    this.loadUser();
                    console.log("✅ Connexion réussie !");
                    this.router.navigate(['/dashboard']); // Redirige après connexion
                },
                error: (err) => {
                    console.error("❌ Erreur de connexion :", err);
                    alert("Échec de connexion : " + (err.error?.error || "Vérifiez vos identifiants"));
                }
            });
    }

    logout() {
        localStorage.removeItem('token');
        this.userSubject.next(null);
        console.log(this.isAuthenticated());
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token'); // Renvoie true si un token est stocké
    }
}