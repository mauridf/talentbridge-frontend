import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';
import { ConviteService, ConviteResponse } from '../../../../core/services/convite.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';

@Component({
  selector: 'app-admin-convites',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, CardModule, InputTextModule,
    TableModule, DialogModule, TagModule, SelectButtonModule,
    ConfirmDialogModule, ToastModule, PageHeaderComponent,
    LoadingSkeletonComponent, EmptyStateComponent, DataBrPipe,
  ],
  providers: [ConfirmationService],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Gerenciar Convites" subtitulo="Criação e gestão de convites para empresas" [mostrarVoltar]="true">
      </app-page-header>

      <div class="flex justify-content-end mb-3">
        <p-button label="Novo Convite" icon="pi pi-plus" (onClick)="exibirCriar = true"></p-button>
      </div>

      @if (carregando) {
        <app-loading-skeleton type="table"></app-loading-skeleton>
      } @else if (convites.length === 0) {
        <app-empty-state icone="pi pi-envelope" titulo="Nenhum convite" descricao="Nenhum convite encontrado."></app-empty-state>
      } @else {
        <div class="card">
          <p-table [value]="convites" styleClass="p-datatable-sm" [paginator]="true" [rows]="10">
            <ng-template pTemplate="header">
              <tr>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Data Expiração</th>
                <th>Ações</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-convite>
              <tr>
                <td>{{ convite.email }}</td>
                <td><p-tag [value]="convite.tipo" [severity]="convite.tipo === 'Empresa' ? 'info' : 'warning'"></p-tag></td>
                <td><p-tag [value]="convite.status" [severity]="convite.status === 'Ativo' ? 'success' : 'danger'"></p-tag></td>
                <td>{{ convite.dataExpiracao | dataBr }}</td>
                <td>
                  @if (convite.status === 'Ativo') {
                    <p-button icon="pi pi-ban" styleClass="p-button-rounded p-button-text p-button-danger p-button-sm"
                      pTooltip="Inativar" (onClick)="confirmarInativar(convite)"></p-button>
                  }
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      }

      <p-dialog [(visible)]="exibirCriar" header="Criar Convite" [modal]="true" styleClass="w-full max-w-30rem">
        <div class="flex flex-column gap-2">
          <label>Email do Convidado</label>
          <input pInputText [(ngModel)]="novoConvite.email" placeholder="email@exemplo.com" />
          <label>Tipo de Convite</label>
          <p-selectButton [options]="tiposConvite" [(ngModel)]="novoConvite.tipo" optionLabel="label" optionValue="value"></p-selectButton>

          @if (novoConvite.tipo === 1) {
            <label>CNPJ</label>
            <input pInputText [(ngModel)]="novoConvite.cnpj" placeholder="Apenas números" />
            <label>Nome da Empresa</label>
            <input pInputText [(ngModel)]="novoConvite.nomeEmpresa" />
            <label>Nome do Responsável</label>
            <input pInputText [(ngModel)]="novoConvite.nomeResponsavel" />
            <label>Telefone</label>
            <input pInputText [(ngModel)]="novoConvite.telefone" placeholder="(11) 99999-9999" />
          }
          <p-button label="Criar Convite" [loading]="salvando" (onClick)="criar()"></p-button>
        </div>
      </p-dialog>
    </div>
  `,
})
export class AdminConvitesComponent implements OnInit {
  carregando = true;
  salvando = false;
  convites: ConviteResponse[] = [];
  exibirCriar = false;

  tiposConvite = [
    { label: 'Recrutador', value: 0 },
    { label: 'Empresa', value: 1 },
  ];

  novoConvite = {
    email: '',
    tipo: 0,
    cnpj: '',
    nomeEmpresa: '',
    nomeResponsavel: '',
    telefone: '',
  };

  empresaId = '';

  constructor(
    private conviteService: ConviteService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.carregando = true;
    this.conviteService.listarPorEmpresa('00000000-0000-0000-0000-000000000000')
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (dados) => this.convites = dados,
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }

  criar(): void {
    if (!this.novoConvite.email) return;
    this.salvando = true;
    this.conviteService.criar(this.novoConvite)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Convite criado!', '');
          this.exibirCriar = false;
          this.carregar();
          this.novoConvite = { email: '', tipo: 0, cnpj: '', nomeEmpresa: '', nomeResponsavel: '', telefone: '' };
        },
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }

  confirmarInativar(convite: ConviteResponse): void {
    this.confirmationService.confirm({
      message: `Inativar convite de ${convite.email}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.inativar(convite.id),
    });
  }

  private inativar(id: string): void {
    this.conviteService.inativar(id).subscribe({
      next: () => {
        this.notificationService.success('Convite inativado!', '');
        this.carregar();
      },
      error: (e) => this.notificationService.error('Erro', e.message),
    });
  }
}