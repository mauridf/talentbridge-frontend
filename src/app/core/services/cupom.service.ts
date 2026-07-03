import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ResultadoDto } from '../models/resultado.dto';

export interface CriarCupomRequest {
  nome: string;
  percentualDesconto: number;
  dataValidade: string;
  parceiroId?: string;
}

export interface CupomResponse {
  id: string;
  nome: string;
  percentualDesconto: number;
  dataValidade: string;
  status: string;
  parceiroNome?: string;
}

@Injectable({ providedIn: 'root' })
export class CupomService {
  private readonly apiUrl = `${environment.apiUrl}/api/Cupom`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<CupomResponse[]> {
    return this.http
      .get<ResultadoDto<CupomResponse[]>>(this.apiUrl)
      .pipe(map((r) => this.extrair(r)));
  }

  criar(request: CriarCupomRequest): Observable<CupomResponse> {
    return this.http
      .post<ResultadoDto<CupomResponse>>(this.apiUrl, request)
      .pipe(map((r) => this.extrair(r)));
  }

  inativar(id: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/Inativar/${id}`, {});
  }

  private extrair<T>(response: ResultadoDto<T>): T {
    if (!response.sucesso || response.valor === null || response.valor === undefined) {
      throw new Error(response.erros?.[0]?.mensagem || 'Erro na requisição');
    }
    return response.valor;
  }
}