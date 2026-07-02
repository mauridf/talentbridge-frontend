import { Injectable } from '@angular/core';
import { JwtClaims } from '../models/auth.models';

/**
 * Serviço responsável por gerenciar tokens JWT
 * - Decodificar JWT para extrair claims
 * - Verificar expiração
 * - Armazenar/Ler token do sessionStorage
 */
@Injectable({
  providedIn: 'root', // Singleton em toda aplicação
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';

  constructor() {}

  /**
   * Salva o access token no sessionStorage
   * Usamos sessionStorage (e não localStorage) por segurança:
   * - sessionStorage é limpo quando o navegador fecha
   * - localStorage persiste indefinidamente (mais vulnerável a XSS)
   */
  salvarToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Recupera o access token do sessionStorage
   * @returns string | null
   */
  obterToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Remove o token do sessionStorage (logout)
   */
  removerToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Verifica se existe um token salvo
   */
  temToken(): boolean {
    return !!this.obterToken();
  }

  /**
   * Decodifica o payload do JWT (sem verificar assinatura)
   * JWT é composto por 3 partes separadas por ponto: header.payload.signature
   * Precisamos apenas do payload (índice 1)
   *
   * @param token JWT access token
   * @returns JwtClaims ou null se inválido
   */
  decodificarToken(token: string): JwtClaims | null {
    try {
      // Divide o token em 3 partes
      const partes = token.split('.');
      if (partes.length !== 3) {
        console.error('Token JWT inválido: não possui 3 partes');
        return null;
      }

      // Pega o payload (segunda parte)
      const payload = partes[1];

      // Decodifica Base64Url -> JSON
      // Substitui caracteres Base64Url por Base64 padrão
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

      // Decodifica o Base64 para string JSON
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );

      // Converte JSON para objeto
      const claims = JSON.parse(jsonPayload) as JwtClaims;

      // Valida campos obrigatórios
      if (!claims.id || !claims.perfil || !claims.nome) {
        console.error('Claims do JWT incompletas:', claims);
        return null;
      }

      return claims;
    } catch (error) {
      console.error('Erro ao decodificar token JWT:', error);
      return null;
    }
  }

  /**
   * Obtém as claims do token atual
   * @returns JwtClaims ou null
   */
  obterClaims(): JwtClaims | null {
    const token = this.obterToken();
    if (!token) return null;
    return this.decodificarToken(token);
  }

  /**
   * Verifica se o token está expirado
   * Adiciona margem de segurança de 30 segundos
   * @returns boolean
   */
  isTokenExpirado(): boolean {
    const claims = this.obterClaims();
    if (!claims) return true;

    // exp é timestamp em segundos desde 1970
    // Multiplicamos por 1000 para converter para milissegundos
    const agora = Date.now();
    const expiracao = claims.exp * 1000;

    // Margem de segurança de 30 segundos
    const margem = 30 * 1000;

    return agora >= expiracao - margem;
  }

  /**
   * Verifica se o token está próximo de expirar
   * Usado para decidir se deve tentar refresh
   * @param minutosAntes Minutos antes da expiração para considerar "próximo"
   * @returns boolean
   */
  isTokenProximoExpirar(minutosAntes: number = 30): boolean {
    const claims = this.obterClaims();
    if (!claims) return true;

    const agora = Date.now();
    const expiracao = claims.exp * 1000;
    const margem = minutosAntes * 60 * 1000;

    return agora >= expiracao - margem;
  }
}
