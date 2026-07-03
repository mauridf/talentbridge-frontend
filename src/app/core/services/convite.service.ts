import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ResultadoDto } from '../models/resultado.dto';

export interface CriarConviteRequest {
  email: string;
  tipo: number;
  cnpj?: string;
  nomeEmpresa?: string;
  nomeResponsavel?: string;
  telefone?: string;
}

export interface ConviteResponse {
  id: string;
  email: string;
  tipo: string;
  status: string;
  token: string;
  dataExpiracao: string;
  dataAceite?: string;
  nomeEmpresa?: string;
}

@Injectable({ providedIn: 'root' })
export class ConviteService {
  private readonly apiUrl = `${environment.apiUrl}/api/Convite`;
  private http = inject(HttpClient);

  criar(request: CriarConviteRequest): Observable<ConviteResponse> {
    return this.http
      .post<ResultadoDto<ConviteResponse>>(this.apiUrl, request)
      .pipe(map((r) => this.extrair(r)));
  }

  listarPorEmpresa(empresaId: string): Observable<ConviteResponse[]> {
    return this.http
      .get<ResultadoDto<ConviteResponse[]>>(`${this.apiUrl}/empresa/${empresaId}`)
      .pipe(map((r) => this.extrair(r)));
  }

  inativar(id: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/${id}/inativar`, {});
  }

  validar(token: string): Observable<ConviteResponse> {
    return this.http
      .post<ResultadoDto<ConviteResponse>>(`${this.apiUrl}/Validar`, { token })
      .pipe(map((r) => this.extrair(r)));
  }

  private extrair<T>(response: ResultadoDto<T>): T {
    if (!response.sucesso || response.valor === null || response.valor === undefined) {
      throw new Error(response.erros?.[0]?.mensagem || 'Erro na requisição');
    }
    return response.valor;
  }
}