import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResultadoDto } from '../../../core/models/resultado.dto';

/**
 * Interfaces para o Dashboard do Candidato
 */
export interface VagaEmAndamento {
  vagaId: string;
  titulo: string;
  empresa: string;
  status: string;
  dataCandidatura: string;
  entrevistaAgendada: boolean;
  dataEntrevista?: string;
}

export interface VagaRecomendada {
  vagaId: string;
  titulo: string;
  empresa: string;
  cidade: string;
  estado: string;
  salario: number;
  compatibilidade: number;
}

export interface UltimaCandidatura {
  vagaId: string;
  titulo: string;
  empresa: string;
  dataCandidatura: string;
  status: string;
  protocolo: string;
}

export interface DashboardCandidatoResponse {
  nome: string;
  statusPerfil: 'completo' | 'incompleto';
  percentualPerfil: number;
  realizouBigFive: boolean;
  totalVagasAplicadas: number;
  totalEntrevistas: number;
  totalContratacoes: number;
  totalVagasVisualizadas: number;
  percentualEntrevistas: number;
  vagasEmAndamento: VagaEmAndamento[];
  vagasRecomendadas: VagaRecomendada[];
  ultimasCandidaturas: UltimaCandidatura[];
  cursoGratuitoVisualizado: boolean;
  cursoGratuitoLink: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardCandidatoService {
  private readonly apiUrl = `${environment.apiUrl}/Dashboard/candidato`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém os dados do dashboard do candidato
   */
  obterDashboard(): Observable<DashboardCandidatoResponse> {
    return this.http
      .post<ResultadoDto<DashboardCandidatoResponse>>(
        this.apiUrl,
        {}, // Body vazio, mas é POST
      )
      .pipe(
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao carregar dashboard');
          }
          return response.valor;
        }),
      );
  }
}
