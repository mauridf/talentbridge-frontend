import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ResultadoDto } from '../models/resultado.dto';

export interface ParametroResponse {
  chave: string;
  valor: string;
  descricao?: string;
}

export interface AtualizarParametroRequest {
  valor: string;
}

@Injectable({ providedIn: 'root' })
export class ParametrosService {
  private readonly apiUrl = `${environment.apiUrl}/api/ParametrosGerais`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ParametroResponse[]> {
    return this.http
      .get<ResultadoDto<ParametroResponse[]>>(this.apiUrl)
      .pipe(map((r) => this.extrair(r)));
  }

  obter(chave: string): Observable<ParametroResponse> {
    return this.http
      .get<ResultadoDto<ParametroResponse>>(`${this.apiUrl}/${chave}`)
      .pipe(map((r) => this.extrair(r)));
  }

  atualizar(chave: string, valor: string): Observable<void> {
    return this.http
      .put<ResultadoDto<void>>(`${this.apiUrl}/${chave}`, { valor } as AtualizarParametroRequest)
      .pipe(map((r) => this.extrair(r)));
  }

  private extrair<T>(response: ResultadoDto<T>): T {
    if (!response.sucesso || response.valor === null || response.valor === undefined) {
      throw new Error(response.erros?.[0]?.mensagem || 'Erro na requisição');
    }
    return response.valor;
  }
}