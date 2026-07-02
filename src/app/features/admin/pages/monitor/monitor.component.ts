import { Component, OnInit } from '@angular/core';
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

      <app-loading-skeleton *ngIf="carregando" type="dashboard"></app-loading-skeleton>

      <app-error-state
        *ngIf="erro && !carregando"
        [mensagem]="mensagemErro"
        (tentarNovamente)="carregarMonitor()"
      >
      </app-error-state>

      <ng-container *ngIf="monitor && !carregando">
        <div class="monitor-grid">
          <div class="monitor-card card" *ngFor="let item of itensMonitor">
            <div class="monitor-card-header">
              <i [class]="item.icone"></i>
              <h4>{{ item.label }}</h4>
            </div>
            <div class="monitor-card-body">
              <span class="monitor-value">{{ item.valor }}</span>
              <p-tag [value]="item.status" [severity]="item.severity"></p-tag>
            </div>
          </div>
        </div>

        <div class="card" *ngIf="monitor.ultimasMigracoes?.length">
          <h3>Últimas Migrações</h3>
          <ul class="migrations-list">
            <li *ngFor="let migracao of monitor.ultimasMigracoes">{{ migracao }}</li>
          </ul>
        </div>
      </ng-container>
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

        i {
          font-size: 1.25rem;
          color: var(--primary-color);
        }
        h4 {
          font-size: 0.9375rem;
          margin: 0;
        }
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

      .migrations-list {
        list-style: none;
        padding: 0;

        li {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--surface-border);
          font-family: monospace;
          font-size: 0.8125rem;
        }
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
  carregando = true;
  erro = false;
  mensagemErro = '';
  monitor?: MonitorResponse;

  constructor(private adminService: AdminService) {}

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

  get itensMonitor(): any[] {
    if (!this.monitor) return [];
    return [
      {
        label: 'Status',
        valor: this.monitor.status,
        icone: 'pi pi-circle-fill',
        status: 'Online',
        severity: 'success',
      },
      {
        label: 'Uptime',
        valor: this.monitor.uptime,
        icone: 'pi pi-clock',
        status: 'Estável',
        severity: 'success',
      },
      {
        label: 'Memória',
        valor: this.monitor.memoria,
        icone: 'pi pi-microchip',
        status: 'OK',
        severity: 'info',
      },
      { label: 'CPU', valor: this.monitor.cpu, icone: 'pi pi-cog', status: 'OK', severity: 'info' },
      {
        label: 'Banco de Dados',
        valor: this.monitor.bancoDados,
        icone: 'pi pi-database',
        status: 'Conectado',
        severity: 'success',
      },
      {
        label: 'Storage',
        valor: this.monitor.storage,
        icone: 'pi pi-cloud',
        status: 'OK',
        severity: 'info',
      },
    ];
  }
}
