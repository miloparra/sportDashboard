import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

console.log("🚀 appConfig chargé !");

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS, // Indiquer qu'il s'agit d'un intercepteur HTTP
      useClass: AuthInterceptor,  // Spécifier l'intercepteur à utiliser
      multi: true,                // Permet d'enregistrer plusieurs intercepteurs
    }
  ]
};
