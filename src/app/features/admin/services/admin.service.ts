import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResultadoDto } from '../../../core/models/resultado.dto';

export interface DashboardAdminResponse {
  totalEmpresas: number;
  totalCandidatos: number;
  totalVagas: number;
  totalVagasAtivas: number;
  totalCandidaturas: number;
  totalContratacoes: number;
  taxaConversao: number;
  empresasRecentes: any[];
  ultimosCadastros: any[];
}

export interface MonitorResponse {
  apiStatus: string;
  dbStatus: string;
  externalApis?: Record<string, string>;
}

export interface GeocodeStatusResponse {
  totalEmpresas: number;
  empresasSemGeocode: number;
  ultimaVarredura?: string;
  emAndamento: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/api/Admin`;

  constructor(private http: HttpClient) {}

  /**
   * Obtém dados do dashboard administrativo
   */
  obterDashboard(): Observable<DashboardAdminResponse> {
    return this.http
      .post<ResultadoDto<DashboardAdminResponse>>(`${this.apiUrl}/Dashboard`, {})
      .pipe(
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao carregar dashboard');
          }
          return response.valor;
        }),
      );
  }

  /**
   * Obtém status de monitoramento do sistema
   */
  obterMonitor(): Observable<MonitorResponse> {
    return this.http.get<ResultadoDto<MonitorResponse>>(`${this.apiUrl}/Monitor`).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao carregar monitor');
        }
        return response.valor;
      }),
    );
  }

  /**
   * Inicia varredura de geocode para empresas sem coordenadas
   */
  iniciarGeocode(): Observable<void> {
    return this.http.post<ResultadoDto<void>>(`${this.apiUrl}/GeocodeMissing`, {}).pipe(
      map((response) => {
        if (!response.sucesso) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao iniciar geocode');
        }
      }),
    );
  }

  /**
   * Obtém status da última varredura de geocode
   */
  obterStatusGeocode(): Observable<GeocodeStatusResponse> {
    return this.http
      .get<ResultadoDto<GeocodeStatusResponse>>(`${this.apiUrl}/GeocodeStatus/latest`)
      .pipe(
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao carregar status');
          }
          return response.valor;
        }),
      );
  }

  /**
   * Lista empresas sem geocode
   */
  obterEmpresasSemGeocode(): Observable<any[]> {
    return this.http.get<ResultadoDto<any[]>>(`${this.apiUrl}/GeocodeMissing/Empresas`).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao carregar empresas');
        }
        return response.valor;
      }),
    );
  }
}
