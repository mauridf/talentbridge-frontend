import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * Interceptor de Loading
 *
 * Responsabilidades:
 * 1. Exibir/esconder indicador de carregamento global
 * 2. Controlar requisições pendentes
 *
 * Só mostra loading se a requisição demorar mais de 500ms
 * (evita flicker em requisições rápidas)
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  // Contador de requisições pendentes
  private totalRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Não mostra loading para algumas URLs (ex: refresh token silencioso)
    const ignorarLoading =
      request.url.includes('/RefreshAcesso') || request.url.includes('/Dominio');

    if (!ignorarLoading) {
      this.totalRequests++;

      // Só mostra loading após 500ms (evita flicker)
      const timer = setTimeout(() => {
        this.loadingService.mostrar();
      }, 500);

      return next.handle(request).pipe(
        finalize(() => {
          clearTimeout(timer); // Cancela o timer se a requisição terminou antes
          this.totalRequests--;

          if (this.totalRequests <= 0) {
            this.totalRequests = 0;
            this.loadingService.esconder();
          }
        }),
      );
    }

    return next.handle(request);
  }
}
