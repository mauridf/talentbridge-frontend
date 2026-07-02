import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { ConviteService, ConviteResponse } from '../../../../core/services/convite.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TokenService } from '../../../../core/services/token.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';

@Component({
  selector: 'app-empresa-convites',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule,
    TableModule, DialogModule, TagModule, SelectButtonModule,
    ConfirmDialogModule, PageHeaderComponent, LoadingSkeletonComponent,
    EmptyStateComponent, DataBrPipe,
  ],
  providers: [ConfirmationService],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Convites" subtitulo="Convide recrutadores para sua empresa" [mostrarVoltar]="true">
      </app-page-header>

      <div class="flex justify-content-end mb-3">
        <p-button label="Convidar Recrutador" icon="pi pi-plus" (onClick)="exibirCriar = true"></p-button>
      </div>

      @if (carregando) {
        <app-loading-skeleton type="table"></app-loading-skeleton>
      } @else if (convites.length === 0) {
        <app-empty-state icone="pi pi-envelope" titulo="Nenhum convite" descricao="Você ainda não enviou nenhum convite."></app-empty-state>
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

      <p-dialog [(visible)]="exibirCriar" header="Convidar Recrutador" [modal]="true" styleClass="w-full max-w-30rem">
        <div class="flex flex-column gap-2">
          <label>Email do Recrutador</label>
          <input pInputText [(ngModel)]="emailConvite" placeholder="email@exemplo.com" />
          <p-button label="Enviar Convite" [loading]="salvando" (onClick)="criarConvite()"></p-button>
        </div>
      </p-dialog>
    </div>
  `,
})
export class EmpresaConvitesComponent implements OnInit {
  carregando = true;
  salvando = false;
  convites: ConviteResponse[] = [];
  exibirCriar = false;
  emailConvite = '';
  empresaId = '';

  constructor(
    private conviteService: ConviteService,
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    const claims = this.tokenService.obterClaims();
    this.empresaId = claims?.idEmpresa || '';
    this.carregar();
  }

  private carregar(): void {
    if (!this.empresaId) return;
    this.carregando = true;
    this.conviteService.listarPorEmpresa(this.empresaId)
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (dados: ConviteResponse[]) => this.convites = dados,
        error: (e: HttpErrorResponse) => this.notificationService.error('Erro', e.message),
      });
  }

  criarConvite(): void {
    if (!this.emailConvite) return;
    this.salvando = true;
    this.conviteService.criar({ email: this.emailConvite, tipo: 0 })
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Convite enviado!', '');
          this.exibirCriar = false;
          this.emailConvite = '';
          this.carregar();
        },
        error: (e: HttpErrorResponse) => this.notificationService.error('Erro', e.message),
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
      error: (e: HttpErrorResponse) => this.notificationService.error('Erro', e.message),
    });
  }
}