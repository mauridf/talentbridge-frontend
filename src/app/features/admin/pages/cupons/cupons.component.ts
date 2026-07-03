import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { finalize } from 'rxjs';
import { CupomService, CupomResponse } from '../../../../core/services/cupom.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';

@Component({
  selector: 'app-cupons',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule,
    CalendarModule, TableModule, DialogModule, TagModule, ConfirmDialogModule,
    PageHeaderComponent, LoadingSkeletonComponent, EmptyStateComponent, DataBrPipe,
  ],
  providers: [ConfirmationService],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Gerenciar Cupons" subtitulo="Criação e gestão de cupons de desconto" [mostrarVoltar]="true">
      </app-page-header>

      <div class="flex justify-content-end mb-3">
        <p-button label="Novo Cupom" icon="pi pi-plus" (onClick)="exibirCriar = true"></p-button>
      </div>

      @if (carregando) {
        <app-loading-skeleton type="table"></app-loading-skeleton>
      } @else if (cupons.length === 0) {
        <app-empty-state icone="pi pi-ticket" titulo="Nenhum cupom" descricao="Nenhum cupom cadastrado."></app-empty-state>
      } @else {
        <div class="card">
          <p-table [value]="cupons" styleClass="p-datatable-sm" [paginator]="true" [rows]="10">
            <ng-template pTemplate="header">
              <tr>
                <th>Nome</th>
                <th>Desconto</th>
                <th>Validade</th>
                <th>Status</th>
                <th>Parceiro</th>
                <th>Ações</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-cupom>
              <tr>
                <td>{{ cupom.nome }}</td>
                <td>{{ cupom.percentualDesconto }}%</td>
                <td>{{ cupom.dataValidade | dataBr }}</td>
                <td><p-tag [value]="cupom.status" [severity]="cupom.status === 'Ativo' ? 'success' : 'danger'"></p-tag></td>
                <td>{{ cupom.parceiroNome || '-' }}</td>
                <td>
                  @if (cupom.status === 'Ativo') {
                    <p-button icon="pi pi-ban" styleClass="p-button-rounded p-button-text p-button-danger p-button-sm"
                      pTooltip="Inativar" (onClick)="confirmarInativar(cupom)"></p-button>
                  }
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      }

      <p-dialog [(visible)]="exibirCriar" header="Criar Cupom" [modal]="true" styleClass="w-full max-w-30rem">
        <div class="flex flex-column gap-2">
          <label>Nome do Cupom</label>
          <input pInputText [(ngModel)]="nome" placeholder="Ex: BEMVINDO10" />
          <label>Percentual de Desconto</label>
          <p-inputNumber [(ngModel)]="percentualDesconto" [min]="1" [max]="100" suffix="%"></p-inputNumber>
          <label>Data de Validade</label>
          <p-calendar [(ngModel)]="dataValidade" dateFormat="dd/mm/yy" [showIcon]="true"></p-calendar>
          <p-button label="Criar Cupom" [loading]="salvando" (onClick)="criar()"></p-button>
        </div>
      </p-dialog>
    </div>
  `,
})
export class CuponsComponent implements OnInit {
  carregando = true;
  salvando = false;
  cupons: CupomResponse[] = [];
  exibirCriar = false;
  nome = '';
  percentualDesconto = 10;
  dataValidade: Date = new Date();

  constructor(
    private cupomService: CupomService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void { this.carregar(); }

  private carregar(): void {
    this.carregando = true;
    this.cupomService.listarTodos()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (dados) => this.cupons = dados,
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }

  criar(): void {
    if (!this.nome) return;
    this.salvando = true;
    this.cupomService.criar({
      nome: this.nome.toUpperCase(),
      percentualDesconto: this.percentualDesconto,
      dataValidade: this.dataValidade.toISOString(),
    })
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Cupom criado!', '');
          this.exibirCriar = false;
          this.carregar();
          this.nome = '';
          this.percentualDesconto = 10;
        },
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }

  confirmarInativar(cupom: CupomResponse): void {
    this.confirmationService.confirm({
      message: `Inativar cupom ${cupom.nome}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cupomService.inativar(cupom.id).subscribe({
          next: () => {
            this.notificationService.success('Cupom inativado!', '');
            this.carregar();
          },
          error: (e) => this.notificationService.error('Erro', e.message),
        });
      },
    });
  }
}