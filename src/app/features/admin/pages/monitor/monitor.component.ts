import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { AdminService, MonitorResponse } from '../../services/admin.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ButtonModule,
    LoadingSkeletonComponent,
    ErrorStateComponent,
    PageHeaderComponent,
  ],
  template: `
    <div class="monitor-page page-container fade-in">
      <app-page-header
        titulo="Monitor do Sistema"
        subtitulo="Diagnóstico e saúde da aplicação"
        [mostrarVoltar]="true"
      >
      </app-page-header>

      @if (carregando) {
        <app-loading-skeleton type="dashboard"></app-loading-skeleton>
      }

      @if (erro && !carregando) {
        <app-error-state
          [mensagem]="mensagemErro"
          (tentarNovamente)="carregarMonitor()"
        >
        </app-error-state>
      }

      @if (monitor && !carregando) {
        <div class="monitor-grid">
          <div class="monitor-card card">
            <div class="monitor-card-header">
              <i class="pi pi-server"></i>
              <h4>API</h4>
            </div>
            <div class="monitor-card-body">
              <span class="monitor-value">{{ monitor.apiStatus }}</span>
              <p-tag
                [value]="monitor.apiStatus === 'Online' ? 'Online' : 'Offline'"
                [severity]="monitor.apiStatus === 'Online' ? 'success' : 'danger'"
              >
              </p-tag>
            </div>
          </div>

          <div class="monitor-card card">
            <div class="monitor-card-header">
              <i class="pi pi-database"></i>
              <h4>Banco de Dados</h4>
            </div>
            <div class="monitor-card-body">
              <span class="monitor-value">{{ monitor.dbStatus }}</span>
              <p-tag
                [value]="monitor.dbStatus === 'Online' ? 'Online' : 'Offline'"
                [severity]="monitor.dbStatus === 'Online' ? 'success' : 'danger'"
              >
              </p-tag>
            </div>
          </div>
        </div>

        @if (monitor.externalApis && getExternalApis().length > 0) {
          <div class="card">
            <h3>APIs Externas</h3>
            <div class="external-apis-list">
              @for (item of getExternalApis(); track item.nome) {
                <div class="external-api-item">
                  <span class="api-name">{{ item.nome }}</span>
                  <span class="api-status">{{ item.status }}</span>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .monitor-page {
        max-width: 900px;
      }
      .monitor-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .monitor-card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }
      .monitor-card-header i {
        font-size: 1.25rem;
        color: var(--primary-color);
      }
      .monitor-card-header h4 {
        font-size: 0.9375rem;
        margin: 0;
      }
      .monitor-card-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .monitor-value {
        font-size: 1.5rem;
        font-weight: 700;
      }
      .external-apis-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .external-api-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--surface-border);
      }
      .api-name {
        font-weight: 600;
      }
      .api-status {
        color: var(--text-color-secondary);
      }
      @media (max-width: 640px) {
        .monitor-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class MonitorComponent implements OnInit {
  private adminService = inject(AdminService);
  carregando = true;
  erro = false;
  mensagemErro = '';
  monitor?: MonitorResponse;

  ngOnInit(): void {
    this.carregarMonitor();
  }

  carregarMonitor(): void {
    this.carregando = true;
    this.erro = false;
    this.adminService
      .obterMonitor()
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (data) => {
          this.monitor = data;
        },
        error: (error) => {
          this.erro = true;
          this.mensagemErro = error.message || 'Erro ao carregar monitor.';
        },
      });
  }

  getExternalApis(): { nome: string; status: string }[] {
    if (!this.monitor?.externalApis) return [];
    return Object.entries(this.monitor.externalApis).map(([nome, status]) => ({ nome, status }));
  }
}
