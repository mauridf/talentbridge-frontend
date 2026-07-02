import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ResultadoDto } from '../models/resultado.dto';

export interface CandidaturaRequest {
  vagaId: string;
  origem?: number;
}

export interface BuscarCandidaturasRequest {
  vagaId?: string;
  candidatoId?: string;
  apenasContratados?: boolean;
  entrevistaRealizada?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface AgendarEntrevistaRequest {
  candidaturaId: string;
  dataHora: string;
  meio: string;
  link?: string;
  duracaoMinutos?: number;
}

export interface ContratarRequest {
  candidaturaId: string;
}

export interface CandidaturaResponse {
  id: string;
  vagaId: string;
  vagaTitulo: string;
  empresaNome: string;
  candidatoId: string;
  candidatoNome: string;
  candidatoEmail: string;
  protocolo?: string;
  contratado: boolean;
  entrevistaRealizada: boolean;
  dataHoraEntrevista?: string;
  meioEntrevista?: string;
  linkEntrevista?: string;
  duracaoEntrevistaMinutos?: number;
  origem?: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CandidaturaService {
  private readonly apiUrl = `${environment.apiUrl}/Candidatura`;

  constructor(private http: HttpClient) {}

  criar(request: CandidaturaRequest): Observable<CandidaturaResponse> {
    return this.http
      .post<ResultadoDto<CandidaturaResponse>>(this.apiUrl, request)
      .pipe(map((r) => this.extrairValor(r)));
  }

  verificar(vagaId: string): Observable<boolean> {
    return this.http
      .post<ResultadoDto<boolean>>(`${this.apiUrl}/verificar`, { vagaId })
      .pipe(map((r) => this.extrairValor(r)));
  }

  buscar(request: BuscarCandidaturasRequest): Observable<CandidaturaResponse[]> {
    return this.http
      .post<ResultadoDto<CandidaturaResponse[]>>(`${this.apiUrl}/Buscar`, request)
      .pipe(map((r) => this.extrairValor(r)));
  }

  listarPorVaga(vagaId: string): Observable<CandidaturaResponse[]> {
    return this.http
      .get<ResultadoDto<CandidaturaResponse[]>>(`${this.apiUrl}/vaga/${vagaId}`)
      .pipe(map((r) => this.extrairValor(r)));
  }

  listarMinhas(): Observable<CandidaturaResponse[]> {
    return this.http
      .get<ResultadoDto<CandidaturaResponse[]>>(`${this.apiUrl}/minhas`)
      .pipe(map((r) => this.extrairValor(r)));
  }

  agendarEntrevista(request: AgendarEntrevistaRequest): Observable<void> {
    return this.http
      .post<ResultadoDto<void>>(`${this.apiUrl}/Entrevista`, request)
      .pipe(map((r) => this.extrairValor(r)));
  }

  marcarEntrevistaRealizada(id: string): Observable<void> {
    return this.http
      .post<ResultadoDto<void>>(`${this.apiUrl}/${id}/entrevista-realizada`, {})
      .pipe(map((r) => this.extrairValor(r)));
  }

  contratar(request: ContratarRequest): Observable<void> {
    return this.http
      .post<ResultadoDto<void>>(`${this.apiUrl}/Contratar`, request)
      .pipe(map((r) => this.extrairValor(r)));
  }

  private extrairValor<T>(response: ResultadoDto<T>): T {
    if (!response.sucesso || response.valor === null || response.valor === undefined) {
      throw new Error(response.erros?.[0]?.mensagem || 'Erro na requisição');
    }
    return response.valor;
  }
}
