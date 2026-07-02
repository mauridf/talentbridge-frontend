import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Otimização de change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Rotas
    provideRouter(routes),

    // HTTP Client (modo legacy para usar interceptors de classe)
    provideHttpClient(withInterceptorsFromDi()),

    // Animações (necessário para PrimeNG)
    provideAnimations(),

    // PrimeNG MessageService (toasts)
    MessageService,

    // Interceptors (ordem importa!)
    // Loading deve ser o primeiro para capturar todas as requisições
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
};
