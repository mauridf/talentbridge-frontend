import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

/**
 * Interceptor de Autenticação
 *
 * Responsabilidades:
 * 1. Adicionar token JWT no header Authorization de todas as requisições
 * 2. Tentar refresh automático do token quando receber 401
 * 3. Evitar múltiplas tentativas simultâneas de refresh
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Flag para evitar múltiplas chamadas de refresh simultâneas
  private isRefreshing = false;

  // Subject para aguardar refresh completar
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Pega o token atual
    const token = this.tokenService.obterToken();

    // Se tem token, adiciona header Authorization
    if (token) {
      request = this.adicionarToken(request, token);
    }

    // Continua a requisição e trata erros
    return next.handle(request).pipe(
      catchError((error) => {
        // Se for erro 401 (não autorizado)
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.tratar401(request, next);
        }

        // Outros erros são propagados
        return throwError(() => error);
      }),
    );
  }

  /**
   * Adiciona o header Authorization na requisição
   */
  private adicionarToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Trata erro 401 tentando refresh do token
   *
   * Fluxo:
   * 1. Se já está fazendo refresh, espera o refresh atual terminar
   * 2. Se não está, inicia o refresh
   * 3. Se refresh falhar, redireciona para login
   */
  private tratar401(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Se já está fazendo refresh, aguarda o resultado
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null), // Espera até ter um token
        take(1), // Pega apenas o primeiro valor
        switchMap((token) => {
          return next.handle(this.adicionarToken(request, token));
        }),
      );
    }

    // Inicia o refresh
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    // Tenta fazer refresh (chamada HTTP para /Usuario/RefreshAcesso)
    // Como o refresh usa cookie httpOnly, não precisamos enviar nada no body
    return next.handle(request).pipe(
      switchMap((event: any) => {
        // Se a resposta do refresh veio com novo token
        // O backend coloca o novo token no header ou no body
        // Depende da implementação do backend
        this.isRefreshing = false;
        this.refreshTokenSubject.next(this.tokenService.obterToken());
        return next.handle(request);
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.error(error);

        // Refresh falhou -> logout
        this.tokenService.removerToken();
        this.router.navigate(['/login']);

        return throwError(() => error);
      }),
    );
  }
}
