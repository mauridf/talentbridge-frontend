import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResultadoDto } from '../../../core/models/resultado.dto';

export interface CriarEmpresaRequest {
  tokenConvite?: string;
  nomeGestor: string;
  emailGestor: string;
  senha: string;
  confirmacaoSenha: string;
  nomeEmpresa: string;
  cnpj: string;
  telefoneEmpresa: string;
  segmentoId: string;
}

export interface CriarEmpresaResponse {
  empresaId: string;
  gestorId: string;
  nomeEmpresa: string;
  nomeGestor: string;
  mensagem: string;
}

export interface EmpresaResponse {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  segmento: string;
  slug: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private readonly apiUrl = `${environment.apiUrl}/Empresa`;

  constructor(private http: HttpClient) {}

  /**
   * Cria uma nova empresa via convite
   */
  criarEmpresa(request: CriarEmpresaRequest): Observable<CriarEmpresaResponse> {
    return this.http.post<ResultadoDto<CriarEmpresaResponse>>(this.apiUrl, request).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao criar empresa');
        }
        return response.valor;
      }),
    );
  }

  /**
   * Valida um token de convite
   */
  validarConvite(token: string): Observable<any> {
    return this.http.get<ResultadoDto<any>>(`${this.apiUrl}/convite/validar/${token}`).pipe(
      map((response) => {
        if (!response.sucesso) {
          throw new Error(response.erros?.[0]?.mensagem || 'Convite inválido');
        }
        return response.valor;
      }),
    );
  }
}
