import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { ConviteService, ConviteResponse } from '../../../../core/services/convite.service';
import { RecrutadorService } from '../../../../core/services/recrutador.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TokenService } from '../../../../core/services/token.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';

interface RecrutadorItem {
  id: string;
  nome: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-empresa-convites',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule,
    TableModule, DialogModule, TagModule, TabViewModule,
    ConfirmDialogModule, PageHeaderComponent, LoadingSkeletonComponent,
    EmptyStateComponent, DataBrPipe,
  ],
  providers: [ConfirmationService],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Colaboradores" subtitulo="Gerencie os recrutadores da sua empresa" [mostrarVoltar]="true">
      </app-page-header>

      <div class="flex gap-2 justify-content-end mb-3">
        <p-button label="Convidar Recrutador" icon="pi pi-envelope" severity="info" (onClick)="exibirConvidar = true"></p-button>
        <p-button label="Adicionar Recrutador" icon="pi pi-user-plus" (onClick)="exibirAdicionar = true"></p-button>
      </div>

      <p-tabView>
        <p-tabPanel header="Recrutadores" leftIcon="pi pi-users">
          @if (carregando) {
            <app-loading-skeleton type="table"></app-loading-skeleton>
          } @else if (recrutadores.length === 0) {
            <app-empty-state icone="pi pi-users" titulo="Nenhum recrutador" descricao="Sua empresa ainda não tem recrutadores cadastrados."></app-empty-state>
          } @else {
            <div class="card">
              <p-table [value]="recrutadores" styleClass="p-datatable-sm" [paginator]="true" [rows]="10">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-r>
                  <tr>
                    <td>{{ r.nome }}</td>
                    <td>{{ r.email }}</td>
                    <td><p-tag [value]="r.status" [severity]="r.status === 'Ativo' ? 'success' : 'danger'"></p-tag></td>
                    <td>
                      @if (r.status === 'Ativo') {
                        <p-button icon="pi pi-ban" styleClass="p-button-rounded p-button-text p-button-danger p-button-sm"
                          pTooltip="Desativar" (onClick)="confirmarDesativarRecrutador(r)"></p-button>
                      }
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          }
        </p-tabPanel>

        <p-tabPanel header="Convites Pendentes" leftIcon="pi pi-envelope">
          @if (carregandoConvites) {
            <app-loading-skeleton type="table"></app-loading-skeleton>
          } @else if (convites.length === 0) {
            <app-empty-state icone="pi pi-envelope" titulo="Nenhum convite pendente" descricao="Você ainda não enviou nenhum convite."></app-empty-state>
          } @else {
            <div class="card">
              <p-table [value]="convites" styleClass="p-datatable-sm" [paginator]="true" [rows]="10">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Data Expiração</th>
                    <th>Ações</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-convite>
                  <tr>
                    <td>{{ convite.email }}</td>
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
        </p-tabPanel>
      </p-tabView>

      <p-dialog [(visible)]="exibirConvidar" header="Convidar Recrutador" [modal]="true" styleClass="w-full max-w-30rem">
        <div class="flex flex-column gap-3 p-3">
          <div class="flex flex-column gap-2">
            <label for="emailConvite">Email do Recrutador</label>
            <input id="emailConvite" pInputText [(ngModel)]="emailConvite" placeholder="recrutador@exemplo.com" />
          </div>
          <p-button label="Enviar Convite" icon="pi pi-send" [loading]="salvandoConvite" (onClick)="criarConvite()"></p-button>
        </div>
      </p-dialog>

      <p-dialog [(visible)]="exibirAdicionar" header="Adicionar Recrutador" [modal]="true" styleClass="w-full max-w-30rem">
        <div class="flex flex-column gap-3 p-3">
          <div class="flex flex-column gap-2">
            <label for="nomeRecrutador">Nome Completo</label>
            <input id="nomeRecrutador" pInputText [(ngModel)]="novoRecrutador.nome" placeholder="Nome do recrutador" />
          </div>
          <div class="flex flex-column gap-2">
            <label for="emailRecrutador">Email</label>
            <input id="emailRecrutador" pInputText [(ngModel)]="novoRecrutador.email" placeholder="recrutador@exemplo.com" />
          </div>
          <div class="flex flex-column gap-2">
            <label for="senhaRecrutador">Senha</label>
            <p-password id="senhaRecrutador" [(ngModel)]="novoRecrutador.senha" [toggleMask]="true" [feedback]="false" placeholder="Mínimo 6 caracteres" styleClass="w-full" inputStyleClass="w-full"></p-password>
          </div>
          <p-button label="Adicionar" icon="pi pi-user-plus" [loading]="salvandoAdicionar" (onClick)="adicionarRecrutador()"></p-button>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .flex.gap-2 { gap: 0.5rem; }
  `],
})
export class EmpresaConvitesComponent implements OnInit {
  private conviteService = inject(ConviteService);
  private recrutadorService = inject(RecrutadorService);
  private notificationService = inject(NotificationService);
  private tokenService = inject(TokenService);
  private confirmationService = inject(ConfirmationService);

  carregando = true;
  carregandoConvites = true;
  salvandoConvite = false;
  salvandoAdicionar = false;
  recrutadores: RecrutadorItem[] = [];
  convites: ConviteResponse[] = [];
  empresaId = '';

  exibirConvidar = false;
  emailConvite = '';

  exibirAdicionar = false;
  novoRecrutador = { nome: '', email: '', senha: '' };

  ngOnInit(): void {
    const claims = this.tokenService.obterClaims();
    this.empresaId = claims?.idEmpresa || '';
    this.carregarRecrutadores();
    this.carregarConvites();
  }

  private carregarRecrutadores(): void {
    this.carregando = true;
    this.recrutadorService.listarPorEmpresa()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (dados) => this.recrutadores = dados,
        error: () => this.notificationService.error('Erro', 'Falha ao carregar recrutadores.'),
      });
  }

  private carregarConvites(): void {
    if (!this.empresaId) return;
    this.carregandoConvites = true;
    this.conviteService.listarPorEmpresa(this.empresaId)
      .pipe(finalize(() => this.carregandoConvites = false))
      .subscribe({
        next: (dados) => this.convites = dados,
        error: () => this.notificationService.error('Erro', 'Falha ao carregar convites.'),
      });
  }

  criarConvite(): void {
    if (!this.emailConvite) {
      this.notificationService.warn('Atenção', 'Informe o email do recrutador.');
      return;
    }
    this.salvandoConvite = true;
    this.conviteService.criar({ email: this.emailConvite, tipo: 0 })
      .pipe(finalize(() => this.salvandoConvite = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Convite enviado!', 'O recrutador receberá um email com as instruções.');
          this.exibirConvidar = false;
          this.emailConvite = '';
          this.carregarConvites();
        },
        error: (e: HttpErrorResponse) => this.notificationService.error('Erro', e.message),
      });
  }

  adicionarRecrutador(): void {
    const r = this.novoRecrutador;
    if (!r.nome || !r.email || !r.senha) {
      this.notificationService.warn('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (r.senha.length < 6) {
      this.notificationService.warn('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    this.salvandoAdicionar = true;
    this.recrutadorService.criarDireto({
      nome: r.nome,
      email: r.email,
      senha: r.senha,
    }).pipe(finalize(() => this.salvandoAdicionar = false))
      .subscribe({
        next: (response) => {
          this.notificationService.success('Recrutador adicionado!', response.mensagem);
          this.exibirAdicionar = false;
          this.novoRecrutador = { nome: '', email: '', senha: '' };
          this.carregarRecrutadores();
        },
        error: (error) => this.notificationService.error('Erro', error.message),
      });
  }

  confirmarInativar(convite: ConviteResponse): void {
    this.confirmationService.confirm({
      message: `Inativar convite de ${convite.email}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.inativarConvite(convite.id),
    });
  }

  private inativarConvite(id: string): void {
    this.conviteService.inativar(id).subscribe({
      next: () => {
        this.notificationService.success('Convite inativado!', '');
        this.carregarConvites();
      },
      error: (e) => this.notificationService.error('Erro', e.message),
    });
  }

  confirmarDesativarRecrutador(recrutador: RecrutadorItem): void {
    this.confirmationService.confirm({
      message: `Desativar recrutador ${recrutador.nome}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.desativarRecrutador(),
    });
  }

  private desativarRecrutador(): void {
    this.notificationService.info('Em breve', 'Funcionalidade de desativar recrutador estará disponível em breve.');
  }
}
