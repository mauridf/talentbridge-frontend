import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResultadoDto } from '../../../core/models/resultado.dto';

export interface VagaLandingPage {
  id: string;
  titulo: string;
  cargo: string;
  cidade: string;
  estado: string;
  salario: number;
  regimeTrabalho: string;
  tipoContratacao: string;
  dataPublicacao: string;
}

export interface EmpresaLandingPage {
  id: string;
  nome: string;
  slug: string;
  logo?: string;
  descricao?: string;
  cidade: string;
  estado: string;
  segmento: string;
  totalVagas: number;
}

export interface VagaDetalheLandingPage {
  id: string;
  titulo: string;
  cargo: string;
  descricao: string;
  atividades: string;
  beneficios: string;
  diferenciaisConsiderados: string;
  salario: number;
  regimeTrabalho: string;
  tipoContratacao: string;
  jornadaTrabalho: string;
  formacaoAcademica: string;
  areaAtuacao: string;
  tempoExperiencia: string;
  cidade: string;
  estado: string;
  quantidadeVagas: number;
  dataPublicacao: string;
  dataCandidaturaFim: string;
  empresaNome: string;
  empresaLogo?: string;
  competencias: CompetenciaLanding[];
}

export interface CompetenciaLanding {
  nome: string;
  nivel: number;
}

export interface LandingPageResponse {
  empresa: EmpresaLandingPage;
  vagas: VagaLandingPage[];
}

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  private readonly apiUrl = `${environment.apiUrl}/api/LandingPage`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém dados da landing page de uma empresa (vagas públicas)
   */
  obterLandingPage(empresaId: string): Observable<LandingPageResponse> {
    return this.http.get<ResultadoDto<LandingPageResponse>>(`${this.apiUrl}/${empresaId}`).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao carregar página');
        }
        return response.valor;
      }),
    );
  }

  /**
   * Busca empresa por slug
   */
  buscarEmpresaPorSlug(slug: string): Observable<EmpresaLandingPage> {
    return this.http.get<ResultadoDto<EmpresaLandingPage>>(`${this.apiUrl}/empresa/${slug}`).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Empresa não encontrada');
        }
        return response.valor;
      }),
    );
  }

  /**
   * Obtém detalhe de uma vaga pública
   */
  obterDetalheVaga(vagaId: string): Observable<VagaDetalheLandingPage> {
    return this.http
      .get<ResultadoDto<VagaDetalheLandingPage>>(`${this.apiUrl}/vaga/${vagaId}`)
      .pipe(
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Vaga não encontrada');
          }
          return response.valor;
        }),
      );
  }
}
