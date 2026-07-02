import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { PerfilUsuario } from '../models/auth.models';

/**
 * Guard que permite acesso apenas para usuários com perfil CANDIDATO
 *
 * Fluxo:
 * 1. Verifica autenticação (token válido)
 * 2. Extrai claims do JWT
 * 3. Verifica se perfil é CANDIDATO
 * 4. Se não for, redireciona para /acesso-negado
 */
export const candidatoGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Primeiro verifica autenticação básica
  if (!tokenService.temToken() || tokenService.isTokenExpirado()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Extrai claims do token
  const claims = tokenService.obterClaims();

  if (!claims || claims.perfil !== PerfilUsuario.CANDIDATO) {
    console.warn('[CandidatoGuard] Acesso negado. Perfil atual:', claims?.perfil);
    router.navigate(['/acesso-negado']);
    return false;
  }

  return true;
};
