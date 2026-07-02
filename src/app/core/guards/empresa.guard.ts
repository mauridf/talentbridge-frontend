import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { PerfilUsuario } from '../models/auth.models';

/**
 * Guard que permite acesso apenas para perfis de empresa
 * (GESTOR_EMPRESA ou RECRUTADOR)
 */
export const empresaGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Verifica autenticação
  if (!tokenService.temToken() || tokenService.isTokenExpirado()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Verifica perfil
  const claims = tokenService.obterClaims();
  const perfisPermitidos = [PerfilUsuario.GESTOR_EMPRESA, PerfilUsuario.RECRUTADOR];

  if (!claims || !perfisPermitidos.includes(claims.perfil as PerfilUsuario)) {
    console.warn('[EmpresaGuard] Acesso negado. Perfil atual:', claims?.perfil);
    router.navigate(['/acesso-negado']);
    return false;
  }

  return true;
};
