import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResultadoDto } from '../../../core/models/resultado.dto';
import { PaginacaoResponseDto, createPaginacaoRequest } from '../../../core/models/paginacao.dto';

export interface VagaUpsertRequest {
  id?: string | null;
  titulo: string;
  cargo: string;
  descricao: string;
  atividades: string;
  beneficios: string;
  diferenciaisConsiderados: string;
  salario: number;
  regimeTrabalho: number;
  jornadaTrabalho: number;
  tipoContratacao: number;
  formacaoAcademica: number;
  formacaoAcademicaEliminatorio: boolean;
  areaAtuacao: number;
  tempoExperiencia: number;
  tempoExperienciaEliminatorio: boolean;
  estado: string;
  cidade: string;
  dataCandidaturaInicio: string;
  dataCandidaturaFim: string;
  tipoVaga: number;
  quantidadeVagas: number;
  competencias?: CompetenciaVagaRequest[];
}

export interface CompetenciaVagaRequest {
  competenciaId: string;
  nivel: number;
  peso: number;
}

export interface VagaResponse {
  id: string;
  titulo: string;
  cargo: string;
  descricao: string;
  salario: number;
  estado: string;
  cidade: string;
  status: string;
  empresaNome: string;
  totalCandidaturas: number;
  dataCriacao: string;
  dataCandidaturaFim: string;
}

export interface BuscarVagasRequest {
  termo?: string;
  cidade?: string;
  estado?: string;
  areaAtuacao?: number;
  regimeTrabalho?: number;
  tipoContratacao?: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class VagaService {
  private readonly apiUrl = `${environment.apiUrl}/Vaga`;

  constructor(private http: HttpClient) {}

  /**
   * Cria ou atualiza uma vaga
   */
  upsert(request: VagaUpsertRequest): Observable<VagaResponse> {
    return this.http.post<ResultadoDto<VagaResponse>>(`${this.apiUrl}/upsert`, request).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao salvar vaga');
        }
        return response.valor;
      }),
    );
  }

  /**
   * Busca vagas com filtros
   */
  buscar(request: BuscarVagasRequest): Observable<PaginacaoResponseDto<VagaResponse>> {
    return this.http
      .post<ResultadoDto<PaginacaoResponseDto<VagaResponse>>>(this.apiUrl, request)
      .pipe(
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao buscar vagas');
          }
          return response.valor;
        }),
      );
  }

  /**
   * Obtém detalhe de uma vaga
   */
  obterPorId(id: string): Observable<VagaResponse> {
    return this.http.get<ResultadoDto<VagaResponse>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Vaga não encontrada');
        }
        return response.valor;
      }),
    );
  }

  /**
   * Lista vagas da empresa
   */
  buscarPorEmpresa(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<PaginacaoResponseDto<VagaResponse>> {
    return this.http
      .post<ResultadoDto<PaginacaoResponseDto<VagaResponse>>>(
        `${this.apiUrl}/empresa`,
        createPaginacaoRequest(pageNumber, pageSize),
      )
      .pipe(
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao buscar vagas');
          }
          return response.valor;
        }),
      );
  }

  /**
   * Encerra uma vaga
   */
  encerrar(vagaId: string): Observable<void> {
    return this.http.post<ResultadoDto<void>>(`${this.apiUrl}/encerrar`, { vagaId }).pipe(
      map((response) => {
        if (!response.sucesso) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao encerrar vaga');
        }
      }),
    );
  }

  /**
   * Reativa uma vaga
   */
  reativar(vagaId: string): Observable<void> {
    return this.http.post<ResultadoDto<void>>(`${this.apiUrl}/reativar`, { vagaId }).pipe(
      map((response) => {
        if (!response.sucesso) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao reativar vaga');
        }
      }),
    );
  }
}
