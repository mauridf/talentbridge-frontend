import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';
import {
  DashboardCandidatoService,
  DashboardCandidatoResponse,
} from '../../services/dashboard-candidato.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TokenService } from '../../../../core/services/token.service';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-candidato',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    CardModule,
    TagModule,
    ProgressBarModule,
    ChartModule,
    TooltipModule,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    DataBrPipe,
  ],
  templateUrl: './dashboard-candidato.component.html',
  styleUrls: ['./dashboard-candidato.component.scss'],
})
export class DashboardCandidatoComponent implements OnInit, OnDestroy {
  carregando = true;
  erro = false;
  mensagemErro = '';

  dashboard?: DashboardCandidatoResponse;

  // Dados para gráfico de compatibilidade
  dadosGrafico: any;
  opcoesGrafico: any;

  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardCandidatoService,
    private notificationService: NotificationService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.carregarDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarDashboard(): void {
    this.carregando = true;
    this.erro = false;

    this.dashboardService
      .obterDashboard()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.carregando = false)),
      )
      .subscribe({
        next: (data) => {
          this.dashboard = data;
          this.configurarGrafico();
        },
        error: (error) => {
          this.erro = true;
          this.mensagemErro = error.message || 'Erro ao carregar dashboard';
          console.error('Erro dashboard:', error);
        },
      });
  }

  private configurarGrafico(): void {
    if (!this.dashboard) return;

    // Gráfico de progresso (entrevistas vs candidaturas)
    this.dadosGrafico = {
      labels: ['Entrevistas', 'Candidaturas', 'Contratações'],
      datasets: [
        {
          data: [
            this.dashboard.totalEntrevistas,
            this.dashboard.totalVagasAplicadas,
            this.dashboard.totalContratacoes,
          ],
          backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
          hoverBackgroundColor: ['#2563EB', '#D97706', '#059669'],
        },
      ],
    };

    this.opcoesGrafico = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  /**
   * Retorna a severidade da tag baseado no status
   */
  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status?.toLowerCase()) {
      case 'em_andamento':
        return 'info';
      case 'entrevista':
        return 'warn';
      case 'contratado':
        return 'success';
      case 'encerrado':
        return 'danger';
      case 'reprovado':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  /**
   * Retorna texto amigável para o status
   */
  getStatusTexto(status: string): string {
    const statusMap: Record<string, string> = {
      em_andamento: 'Em Andamento',
      entrevista: 'Entrevista',
      contratado: 'Contratado',
      encerrado: 'Encerrado',
      reprovado: 'Reprovado',
    };
    return statusMap[status] || status;
  }

  /**
   * Retorna cor baseada na porcentagem de compatibilidade
   */
  getCorCompatibilidade(percentual: number): string {
    if (percentual >= 80) return '#10B981'; // Verde - Alta
    if (percentual >= 60) return '#3B82F6'; // Azul - Média
    if (percentual >= 40) return '#F59E0B'; // Laranja - Regular
    return '#EF4444'; // Vermelho - Baixa
  }
}
