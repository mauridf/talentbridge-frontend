import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { ParametrosService, ParametroResponse } from '../../../../core/services/parametros.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-parametros-gerais',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule,
    TableModule, DialogModule, TagModule, PageHeaderComponent,
    LoadingSkeletonComponent, EmptyStateComponent,
  ],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Parâmetros Gerais" subtitulo="Configurações do sistema" [mostrarVoltar]="true">
      </app-page-header>

      @if (carregando) {
        <app-loading-skeleton type="table"></app-loading-skeleton>
      } @else if (parametros.length === 0) {
        <app-empty-state icone="pi pi-cog" titulo="Nenhum parâmetro" descricao="Nenhum parâmetro encontrado."></app-empty-state>
      } @else {
        <div class="card">
          <p-table [value]="parametros" styleClass="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>Chave</th>
                <th>Valor</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-param>
              <tr>
                <td><code>{{ param.chave }}</code></td>
                <td>{{ param.valor }}</td>
                <td>{{ param.descricao || '-' }}</td>
                <td>
                  <p-button icon="pi pi-pencil" styleClass="p-button-rounded p-button-text p-button-sm"
                    pTooltip="Editar" (onClick)="editar(param)"></p-button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      }

      <p-dialog [(visible)]="exibirEditar" [header]="'Editar: ' + editandoChave" [modal]="true" styleClass="w-full max-w-30rem">
        <div class="flex flex-column gap-2">
          <label>Valor</label>
          <input pInputText [(ngModel)]="editandoValor" />
          <p-button label="Salvar" [loading]="salvando" (onClick)="salvar()"></p-button>
        </div>
      </p-dialog>
    </div>
  `,
})
export class ParametrosGeraisComponent implements OnInit {
  carregando = true;
  salvando = false;
  parametros: ParametroResponse[] = [];
  exibirEditar = false;
  editandoChave = '';
  editandoValor = '';

  constructor(
    private parametrosService: ParametrosService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void { this.carregar(); }

  private carregar(): void {
    this.carregando = true;
    this.parametrosService.listarTodos()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (dados) => this.parametros = dados,
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }

  editar(param: ParametroResponse): void {
    this.editandoChave = param.chave;
    this.editandoValor = param.valor;
    this.exibirEditar = true;
  }

  salvar(): void {
    this.salvando = true;
    this.parametrosService.atualizar(this.editandoChave, this.editandoValor)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Parâmetro atualizado!', '');
          this.exibirEditar = false;
          this.carregar();
        },
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }
}