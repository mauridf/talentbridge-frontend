import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { AdminService, DashboardAdminResponse } from '../../services/admin.service';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    TagModule,
    LoadingSkeletonComponent,
    ErrorStateComponent,
    PageHeaderComponent,
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  carregando = true;
  erro = false;
  mensagemErro = '';

  dashboard?: DashboardAdminResponse;

  dadosGrafico: any;
  opcoesGrafico: any;

  private destroy$ = new Subject<void>();

  constructor(private adminService: AdminService) {}

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

    this.adminService
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
        },
      });
  }

  private configurarGrafico(): void {
    if (!this.dashboard) return;

    this.dadosGrafico = {
      labels: ['Empresas', 'Candidatos', 'Vagas Ativas', 'Contratados'],
      datasets: [
        {
          data: [
            this.dashboard.totalEmpresas,
            this.dashboard.totalCandidatos,
            this.dashboard.totalVagasAtivas,
            this.dashboard.totalContratacoes,
          ],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
          hoverBackgroundColor: ['#2563EB', '#059669', '#D97706', '#7C3AED'],
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
}
