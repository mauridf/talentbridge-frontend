import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { AdminService, GeocodeStatusResponse } from '../../services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-geocode',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, CardModule, TableModule, TagModule,
    PageHeaderComponent, LoadingSkeletonComponent,
  ],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Geocode" subtitulo="Gerenciamento de coordenadas" [mostrarVoltar]="true">
      </app-page-header>

      @if (carregandoStatus) {
        <app-loading-skeleton type="dashboard"></app-loading-skeleton>
      } @else {
        <div class="grid mb-3">
          <div class="col-4">
            <div class="card text-center">
              <span style="font-size: 2rem; font-weight: 700;">{{ status?.totalEmpresas || 0 }}</span>
              <p>Total de Empresas</p>
            </div>
          </div>
          <div class="col-4">
            <div class="card text-center">
              <span style="font-size: 2rem; font-weight: 700; color: var(--orange-500);">{{ status?.empresasSemGeocode || 0 }}</span>
              <p>Sem Geocode</p>
            </div>
          </div>
          <div class="col-4">
            <div class="card text-center">
              <p-tag [value]="status?.emAndamento ? 'Em Andamento' : 'Parado'"
                [severity]="status?.emAndamento ? 'warning' : 'info'"></p-tag>
              <p>Status</p>
            </div>
          </div>
        </div>

        <div class="flex gap-2 mb-3">
          <p-button label="Iniciar Varredura" icon="pi pi-play" [loading]="iniciando" (onClick)="iniciar()"></p-button>
          <p-button label="Atualizar Status" icon="pi pi-refresh" (onClick)="carregarStatus()"></p-button>
        </div>

        @if (ultimaVarredura) {
          <div class="card">
            <p>Última varredura: {{ ultimaVarredura }}</p>
          </div>
        }

        @if (empresas.length > 0) {
          <div class="card">
            <h4>Empresas sem Geocode</h4>
            <p-table [value]="empresas" styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr><th>Nome</th><th>CNPJ</th><th>Cidade</th></tr>
              </ng-template>
              <ng-template pTemplate="body" let-e>
                <tr>
                  <td>{{ e.nome || e.nomeEmpresa || '-' }}</td>
                  <td>{{ e.cnpj || '-' }}</td>
                  <td>{{ e.cidade || '-' }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        }
      }
    </div>
  `,
})
export class GeocodeComponent implements OnInit {
  carregandoStatus = true;
  iniciando = false;
  status: GeocodeStatusResponse | null = null;
  empresas: any[] = [];
  ultimaVarredura = '';

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.carregarStatus();
    this.carregarEmpresas();
  }

  carregarStatus(): void {
    this.carregandoStatus = true;
    this.adminService.obterStatusGeocode()
      .pipe(finalize(() => this.carregandoStatus = false))
      .subscribe({
        next: (s) => {
          this.status = s;
          this.ultimaVarredura = s.ultimaVarredura || '';
        },
        error: () => this.carregandoStatus = false,
      });
  }

  private carregarEmpresas(): void {
    this.adminService.obterEmpresasSemGeocode().subscribe({
      next: (dados) => this.empresas = dados,
      error: () => {},
    });
  }

  iniciar(): void {
    this.iniciando = true;
    this.adminService.iniciarGeocode()
      .pipe(finalize(() => this.iniciando = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Varredura iniciada!', '');
          this.carregarStatus();
        },
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }
}