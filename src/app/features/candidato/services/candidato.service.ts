import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResultadoDto } from '../../../core/models/resultado.dto';

/**
 * Interfaces para o serviço de candidato
 */
export interface CriarCandidatoRequest {
  nome: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
  dataNascimento: string;
  telefone: string;
  nomeSocial?: string;
  codigoParceiro?: string;
}

export interface CandidatoResponse {
  id: string;
  nome: string;
  email: string;
  mensagem: string;
}

@Injectable({
  providedIn: 'root',
})
export class CandidatoService {
  private readonly apiUrl = `${environment.apiUrl}/Candidato`;

  constructor(private http: HttpClient) {}

  /**
   * Cria um novo candidato (registro público)
   */
  criar(request: CriarCandidatoRequest): Observable<CandidatoResponse> {
    return this.http.post<ResultadoDto<CandidatoResponse>>(this.apiUrl, request).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao criar candidato');
        }
        return response.valor;
      }),
    );
  }

  /**
   * Confirma o email do candidato
   */
  confirmarEmail(email: string, token: string): Observable<void> {
    return this.http
      .post<ResultadoDto<void>>(`${this.apiUrl}/confirmarEmail`, { email, token })
      .pipe(
        map((response) => {
          if (!response.sucesso) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao confirmar email');
          }
        }),
      );
  }

  /**
   * Reenvia email de confirmação
   */
  reenviarConfirmacaoEmail(email: string): Observable<void> {
    return this.http
      .post<ResultadoDto<void>>(`${this.apiUrl}/reenviarConfirmacaoEmail`, { email })
      .pipe(
        map((response) => {
          if (!response.sucesso) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao reenviar email');
          }
        }),
      );
  }
}
