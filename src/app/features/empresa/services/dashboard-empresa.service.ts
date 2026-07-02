import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResultadoDto } from '../../../core/models/resultado.dto';

export interface CandidaturasPorDia {
  data: string;
  quantidade: number;
}

export interface MelhorCandidato {
  candidatoId: string;
  nome: string;
  email: string;
  cidade: string;
  compatibilidade: number;
  distanciaKm: number;
  realizouBigFive: boolean;
}

export interface VagaProximaVencer {
  vagaId: string;
  titulo: string;
  dataVencimento: string;
  diasRestantes: number;
  totalCandidaturas: number;
  status: string;
}

export interface DashboardEmpresaResponse {
  totalVagasAtivas: number;
  totalVagasEncerradas: number;
  totalCandidaturas: number;
  totalCandidaturasPeriodo: number;
  totalVisitas: number;
  totalContratados: number;
  mediaCandidatosPorVaga: number;
  creditosDisponiveis: number;
  creditosUsados: number;
  candidaturasPorDia: CandidaturasPorDia[];
  melhoresCandidatos: MelhorCandidato[];
  ultimasCandidaturas: any[];
  vagasProximasVencer: VagaProximaVencer[];
  totalRecrutadores: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardEmpresaService {
  private readonly apiUrl = `${environment.apiUrl}/Dashboard/empresa`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém dados do dashboard da empresa
   */
  obterDashboard(periodoDias: number = 30): Observable<DashboardEmpresaResponse> {
    return this.http
      .post<ResultadoDto<DashboardEmpresaResponse>>(this.apiUrl, { periodoDias })
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
