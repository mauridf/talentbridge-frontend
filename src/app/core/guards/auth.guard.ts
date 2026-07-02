import { Injectable, inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * Guard que verifica se o usuário está autenticado
 *
 * Funcionamento:
 * 1. Verifica se existe token salvo
 * 2. Verifica se o token NÃO está expirado
 * 3. Se inválido/expirado, redireciona para /login
 * 4. Se válido, permite acesso à rota
 *
 * Uso nas rotas:
 * { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Verifica se tem token
  if (!tokenService.temToken()) {
    console.log('[AuthGuard] Token não encontrado. Redirecionando para login.');

    // Salva a URL tentada para redirecionar após login
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Verifica se o token está expirado
  if (tokenService.isTokenExpirado()) {
    console.log('[AuthGuard] Token expirado. Redirecionando para login.');

    // Remove o token expirado
    tokenService.removerToken();

    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Token válido
  return true;
};
