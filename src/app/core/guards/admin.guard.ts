import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { PerfilUsuario } from '../models/auth.models';

/**
 * Guard que permite acesso apenas para ADMIN
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.temToken() || tokenService.isTokenExpirado()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const claims = tokenService.obterClaims();

  if (!claims || claims.perfil !== PerfilUsuario.ADMIN) {
    console.warn('[AdminGuard] Acesso negado. Perfil atual:', claims?.perfil);
    router.navigate(['/acesso-negado']);
    return false;
  }

  return true;
};
