import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { TokenService } from '@core/services/token.service';
import {
  LoginRequestDto,
  LoginResponseDto,
  LoginMultiPerfilResponseDto,
  SelecionarPerfilRequestDto,
  SelecionarEmpresaRequestDto,
  RefreshTokenResponseDto,
  AuthState,
  PerfilUsuario,
} from '@core/models/auth.models';
import { ResultadoDto } from '@core/models/resultado.dto';

/**
 * Serviço de Autenticação
 *
 * Responsável por todo o fluxo de autenticação:
 * - Login (incluindo multi-perfil e multi-empresa)
 * - Seleção de perfil/empresa
 * - Refresh token
 * - Logout
 * - Estado de autenticação
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/Usuario`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  /**
   * Realiza o login do usuário
   *
   * Fluxos possíveis:
   * 1. Login simples (1 perfil, 1 empresa) → retorna LoginResponseDto
   * 2. Multi-perfil (usuário tem mais de 1 perfil) → retorna LoginMultiPerfilResponseDto
   * 3. Multi-empresa (usuário tem mais de 1 empresa) → retorna LoginMultiPerfilResponseDto
   *
   * @param credentials Email e senha
   * @returns Observable com a resposta do login
   */
  login(credentials: LoginRequestDto): Observable<LoginResponseDto | LoginMultiPerfilResponseDto> {
    return this.http
      .post<ResultadoDto<LoginResponseDto | LoginMultiPerfilResponseDto>>(
        `${this.apiUrl}/Autenticar`,
        credentials,
      )
      .pipe(
        map((response) => {
          // Verifica se a requisição foi bem-sucedida
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao realizar login');
          }
          return response.valor;
        }),
        tap((response) => {
          // Se for login simples (já veio accessToken), salva o token
          if ('accessToken' in response && response.accessToken) {
            this.tokenService.salvarToken(response.accessToken);
          }
          // Se for multi-perfil ou multi-empresa, NÃO salva o token temporário
          // (será salvo após a seleção)
        }),
        catchError((error: HttpErrorResponse) => {
          // Trata erros específicos
          if (error.status === 429) {
            return throwError(() => new Error('Muitas tentativas de login. Aguarde um momento.'));
          }
          if (error.status === 400 && error.error?.erros) {
            return throwError(
              () => new Error(error.error.erros[0]?.mensagem || 'Credenciais inválidas.'),
            );
          }
          return throwError(() => error);
        }),
      );
  }

  /**
   * Seleciona o perfil quando o usuário tem múltiplos perfis
   * Chamado após login multi-perfil
   *
   * @param tokenTemporario Token temporário do login inicial
   * @param perfilCodigo Código do perfil selecionado
   */
  selecionarPerfil(tokenTemporario: string, perfilCodigo: string): Observable<LoginResponseDto> {
    const request: SelecionarPerfilRequestDto = {
      tokenTemporario,
      perfilCodigo,
    };

    return this.http
      .post<ResultadoDto<LoginResponseDto>>(`${this.apiUrl}/SelecionarPerfil`, request)
      .pipe(
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao selecionar perfil');
          }
          return response.valor;
        }),
        tap((response) => {
          // Salva o token definitivo
          this.tokenService.salvarToken(response.accessToken);
        }),
      );
  }

  /**
   * Seleciona a empresa quando o usuário tem múltiplas empresas
   *
   * @param idEmpresa ID da empresa selecionada
   */
  selecionarEmpresa(idEmpresa: string): Observable<LoginResponseDto> {
    const request: SelecionarEmpresaRequestDto = { idEmpresa };

    return this.http
      .post<ResultadoDto<LoginResponseDto>>(`${this.apiUrl}/SelecionarEmpresa`, request)
      .pipe(
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao selecionar empresa');
          }
          return response.valor;
        }),
        tap((response) => {
          // Atualiza o token com o novo (que inclui a empresa selecionada)
          this.tokenService.salvarToken(response.accessToken);
        }),
      );
  }

  /**
   * Tenta renovar o access token usando o refresh token (cookie httpOnly)
   *
   * O backend lê o cookie automaticamente, não precisamos enviar nada
   */
  refreshToken(): Observable<RefreshTokenResponseDto> {
    return this.http
      .get<ResultadoDto<RefreshTokenResponseDto>>(
        `${this.apiUrl}/RefreshAcesso`,
        { withCredentials: true }, // Importante: envia cookies
      )
      .pipe(
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error('Falha ao renovar token');
          }
          return response.valor;
        }),
        tap((response) => {
          // Atualiza o token salvo
          this.tokenService.salvarToken(response.accessToken);
        }),
        catchError((error) => {
          console.error('Erro ao renovar token:', error);
          // Se falhar o refresh, faz logout
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  /**
   * Verifica se o email está disponível para cadastro
   *
   * @param email Email a ser verificado
   */
  verificarEmailDisponivel(email: string): Observable<boolean> {
    return this.http
      .get<ResultadoDto<boolean>>(
        `${this.apiUrl}/EmailDisponivel?email=${encodeURIComponent(email)}`,
      )
      .pipe(
        map((response) => {
          if (!response.sucesso) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao verificar email');
          }
          return response.valor ?? false;
        }),
      );
  }

  /**
   * Solicita email de recuperação de senha
   *
   * @param email Email do usuário
   */
  solicitarRecuperacaoSenha(email: string): Observable<void> {
    return this.http.post<ResultadoDto<void>>(`${this.apiUrl}/ResetSenhaEmail`, { email }).pipe(
      map((response) => {
        if (!response.sucesso) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao solicitar recuperação');
        }
      }),
    );
  }

  /**
   * Redefine a senha com o token de recuperação
   *
   * @param token Token recebido por email
   * @param novaSenha Nova senha
   * @param confirmacaoSenha Confirmação da nova senha
   */
  redefinirSenha(token: string, novaSenha: string, confirmacaoSenha: string): Observable<void> {
    return this.http
      .put<ResultadoDto<void>>(`${this.apiUrl}/RecuperacaoSenha`, {
        token,
        novaSenha,
        confirmacaoSenha,
      })
      .pipe(
        map((response) => {
          if (!response.sucesso) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao redefinir senha');
          }
        }),
      );
  }

  /**
   * Obtém o estado atual de autenticação
   * Útil para componentes que precisam saber se usuário está logado e seu perfil
   */
  obterEstadoAutenticacao(): AuthState {
    const claims = this.tokenService.obterClaims();
    const token = this.tokenService.obterToken();

    return {
      isAuthenticated: !!token && !this.tokenService.isTokenExpirado(),
      accessToken: token,
      claims: claims,
      perfil: (claims?.perfil as PerfilUsuario) || null,
      nome: claims?.nome || '',
      email: claims?.nome || '', // O email não está nas claims, mas podemos buscar depois
      empresaId: claims?.idEmpresa || null,
      empresaNome: null, // Será preenchido quando necessário
    };
  }

  /**
   * Realiza o logout do usuário
   * Remove o token e redireciona para login
   */
  logout(): void {
    this.tokenService.removerToken();
    // Opcional: limpar outros dados do usuário
    sessionStorage.clear();
  }

  /**
   * Verifica se o usuário tem um determinado perfil
   *
   * @param perfil Perfil a verificar
   */
  temPerfil(perfil: PerfilUsuario): boolean {
    const claims = this.tokenService.obterClaims();
    return claims?.perfil === perfil;
  }

  /**
   * Verifica se a resposta é multi-perfil
   */
  isMultiPerfil(
    response: LoginResponseDto | LoginMultiPerfilResponseDto,
  ): response is LoginMultiPerfilResponseDto {
    return 'multiPerfil' in response && response.multiPerfil === true;
  }

  /**
   * Verifica se a resposta é multi-empresa
   */
  isMultiEmpresa(
    response: LoginResponseDto | LoginMultiPerfilResponseDto,
  ): response is LoginMultiPerfilResponseDto {
    return 'multiEmpresa' in response && response.multiEmpresa === true;
  }
}
