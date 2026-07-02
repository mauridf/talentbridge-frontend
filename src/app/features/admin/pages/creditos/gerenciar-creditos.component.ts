import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { CreditoService, CreditosResponse } from '../../../../core/services/credito.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-gerenciar-creditos',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, CardModule, InputTextModule,
    InputNumberModule, TableModule, DialogModule, TagModule,
    PageHeaderComponent, LoadingSkeletonComponent,
  ],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Gerenciar Créditos" subtitulo="Adicionar e remover créditos de empresas" [mostrarVoltar]="true">
      </app-page-header>

      <div class="card mb-3">
        <div class="flex align-items-center gap-2">
          <input pInputText [(ngModel)]="empresaIdInput" placeholder="ID da Empresa" style="width: 300px;" />
          <p-button label="Consultar" icon="pi pi-search" (onClick)="consultar()"></p-button>
        </div>
      </div>

      @if (carregando) {
        <app-loading-skeleton type="table"></app-loading-skeleton>
      }

      @if (creditos && !carregando) {
        <div class="grid mb-3">
          <div class="col-4">
            <div class="card text-center">
              <span style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">{{ creditos.totalCreditos }}</span>
              <p style="color: var(--text-color-secondary);">Total</p>
            </div>
          </div>
          <div class="col-4">
            <div class="card text-center">
              <span style="font-size: 2rem; font-weight: 700; color: var(--orange-500);">{{ creditos.creditosUsados }}</span>
              <p style="color: var(--text-color-secondary);">Usados</p>
            </div>
          </div>
          <div class="col-4">
            <div class="card text-center">
              <span style="font-size: 2rem; font-weight: 700; color: var(--green-500);">{{ creditos.creditosDisponiveis }}</span>
              <p style="color: var(--text-color-secondary);">Disponíveis</p>
            </div>
          </div>
        </div>

        <div class="flex gap-2 mb-3">
          <p-button label="Adicionar Créditos" icon="pi pi-plus" severity="success" (onClick)="exibirAdicionar = true"></p-button>
          <p-button label="Remover Créditos" icon="pi pi-minus" severity="danger" (onClick)="exibirRemover = true"></p-button>
        </div>

        @if (creditos.creditosPorProduto?.length) {
          <div class="card">
            <h4>Créditos por Produto</h4>
            <p-table [value]="creditos.creditosPorProduto" styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr><th>Produto</th><th>Créditos</th></tr>
              </ng-template>
              <ng-template pTemplate="body" let-item>
                <tr><td>{{ item.nomeProduto }}</td><td>{{ item.creditos }}</td></tr>
              </ng-template>
            </p-table>
          </div>
        }
      }

      <p-dialog [(visible)]="exibirAdicionar" header="Adicionar Créditos" [modal]="true" styleClass="w-full max-w-30rem">
        <div class="flex flex-column gap-2 p-3">
          <label>Quantidade</label>
          <p-inputNumber [(ngModel)]="quantidade" [min]="1"></p-inputNumber>
          <label>Motivo (opcional)</label>
          <input pInputText [(ngModel)]="motivo" placeholder="Ex: Bônus promocional" />
          <p-button label="Adicionar" [loading]="salvando" (onClick)="adicionar()"></p-button>
        </div>
      </p-dialog>

      <p-dialog [(visible)]="exibirRemover" header="Remover Créditos" [modal]="true" styleClass="w-full max-w-30rem">
        <div class="flex flex-column gap-2 p-3">
          <label>Quantidade</label>
          <p-inputNumber [(ngModel)]="quantidade" [min]="1"></p-inputNumber>
          <label>Motivo (opcional)</label>
          <input pInputText [(ngModel)]="motivo" placeholder="Ex: Estorno" />
          <p-button label="Remover" [loading]="salvando" severity="danger" (onClick)="remover()"></p-button>
        </div>
      </p-dialog>
    </div>
  `,
})
export class GerenciarCreditosComponent implements OnInit {
  empresaIdInput = '';
  creditos: CreditosResponse | null = null;
  carregando = false;
  exibirAdicionar = false;
  exibirRemover = false;
  quantidade = 10;
  motivo = '';
  salvando = false;

  constructor(
    private creditoService: CreditoService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {}

  consultar(): void {
    if (!this.empresaIdInput) return;
    this.carregando = true;
    this.creditos = null;
    this.creditoService.saldoEmpresa(this.empresaIdInput)
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (c) => this.creditos = c,
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }

  adicionar(): void {
    this.salvando = true;
    this.creditoService.adminAdicionar(this.empresaIdInput, this.quantidade, this.motivo)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Créditos adicionados!', '');
          this.exibirAdicionar = false;
          this.consultar();
        },
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }

  remover(): void {
    this.salvando = true;
    this.creditoService.adminRemover(this.empresaIdInput, this.quantidade, this.motivo)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Créditos removidos!', '');
          this.exibirRemover = false;
          this.consultar();
        },
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }
}