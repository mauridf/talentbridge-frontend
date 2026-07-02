import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

/**
 * Interceptor de Tratamento de Erros
 *
 * Responsabilidades:
 * 1. Capturar todos os erros HTTP
 * 2. Exibir toasts com mensagens amigáveis
 * 3. Tratar casos especiais (429 Rate Limit, etc.)
 * 4. Retry automático para erros 500
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // Tenta novamente 1 vez em caso de erro 500
      retry({
        count: 1,
        delay: (error: HttpErrorResponse) => {
          // Só retry se for erro 500 ou 0 (rede)
          if (error.status === 500 || error.status === 0) {
            return throwError(() => error);
          }
          return throwError(() => error);
        },
      }),

      catchError((error: HttpErrorResponse) => {
        // Trata cada tipo de erro
        this.tratarErro(error);

        // Propaga o erro para que os services/components também possam tratar
        return throwError(() => error);
      }),
    );
  }

  /**
   * Trata o erro HTTP e exibe notificação apropriada
   */
  private tratarErro(error: HttpErrorResponse): void {
    // Erro de rede (servidor offline, CORS, etc.)
    if (error.status === 0) {
      this.notificationService.error(
        'Erro de Conexão',
        'Não foi possível conectar ao servidor. Verifique sua conexão de internet.',
        10000,
      );
      return;
    }

    // Rate limit excedido
    if (error.status === 429) {
      this.notificationService.warn(
        'Muitas Requisições',
        'Você está fazendo muitas requisições. Aguarde um momento e tente novamente.',
        10000,
      );
      return;
    }

    // Erro interno do servidor
    if (error.status === 500) {
      this.notificationService.error(
        'Erro do Servidor',
        'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
        10000,
      );
      return;
    }

    // Erro de validação (400) - tenta extrair erros do body
    if (error.status === 400 && error.error) {
      const body = error.error;

      // Se for o padrão ResultadoDto
      if (body.erros && Array.isArray(body.erros) && body.erros.length > 0) {
        this.notificationService.exibirErros(body.erros);
        return;
      }

      // Se for erro de validação do ASP.NET
      if (body.errors && typeof body.errors === 'object') {
        const mensagens = Object.values(body.errors).flat() as string[];
        mensagens.forEach((msg) => {
          this.notificationService.warn('Validação', msg, 8000);
        });
        return;
      }
    }

    // Erro 404
    if (error.status === 404) {
      this.notificationService.warn(
        'Não Encontrado',
        'O recurso solicitado não foi encontrado.',
        5000,
      );
      return;
    }

    // Erro 403
    if (error.status === 403) {
      this.notificationService.error(
        'Acesso Negado',
        'Você não tem permissão para acessar este recurso.',
        5000,
      );
      return;
    }

    // Erro genérico (outros status codes)
    this.notificationService.error(
      'Erro',
      error.message || 'Ocorreu um erro inesperado. Tente novamente.',
      5000,
    );
  }
}
