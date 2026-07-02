import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';
import {
  DashboardEmpresaService,
  DashboardEmpresaResponse,
  CandidaturasPorDia,
} from '../../services/dashboard-empresa.service';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-empresa',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    CardModule,
    TagModule,
    ChartModule,
    TooltipModule,
    LoadingSkeletonComponent,
    ErrorStateComponent,
    PageHeaderComponent,
  ],
  templateUrl: './dashboard-empresa.component.html',
  styleUrls: ['./dashboard-empresa.component.scss'],
})
export class DashboardEmpresaComponent implements OnInit, OnDestroy {
  carregando = true;
  erro = false;
  mensagemErro = '';

  dashboard?: DashboardEmpresaResponse;

  // Dados do gráfico
  dadosGraficoCandidaturas: any;
  opcoesGraficoCandidaturas: any;

  private destroy$ = new Subject<void>();

  constructor(private dashboardService: DashboardEmpresaService) {}

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
          this.configurarGraficos();
        },
        error: (error) => {
          this.erro = true;
          this.mensagemErro = error.message || 'Erro ao carregar dashboard';
        },
      });
  }

  private configurarGraficos(): void {
    if (!this.dashboard) return;

    // Gráfico de candidaturas por dia
    const datas = this.dashboard.candidaturasPorDia.map((d) => {
      const partes = d.data.split('-');
      return `${partes[2]}/${partes[1]}`;
    });
    const quantidades = this.dashboard.candidaturasPorDia.map((d) => d.quantidade);

    this.dadosGraficoCandidaturas = {
      labels: datas,
      datasets: [
        {
          label: 'Candidaturas',
          data: quantidades,
          fill: true,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
      ],
    };

    this.opcoesGraficoCandidaturas = {
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status?.toLowerCase()) {
      case 'aberta':
        return 'success';
      case 'encerrada':
        return 'danger';
      case 'proxima_vencer':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getStatusTexto(status: string): string {
    const map: Record<string, string> = {
      aberta: 'Aberta',
      encerrada: 'Encerrada',
      proxima_vencer: 'Próxima do Vencimento',
    };
    return map[status] || status;
  }
}
