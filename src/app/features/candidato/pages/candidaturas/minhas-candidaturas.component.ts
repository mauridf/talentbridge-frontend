import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { CandidaturaService, CandidaturaResponse } from '../../../../core/services/candidatura.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';

@Component({
  selector: 'app-minhas-candidaturas',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ButtonModule, TagModule, TableModule,
    PageHeaderComponent, LoadingSkeletonComponent, EmptyStateComponent,
    ErrorStateComponent, DataBrPipe,
  ],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Minhas Candidaturas" subtitulo="Acompanhe suas candidaturas"></app-page-header>

      <app-loading-skeleton *ngIf="carregando" type="table" [quantidade]="5"></app-loading-skeleton>

      <app-error-state
        *ngIf="erro && !carregando"
        [mensagem]="mensagemErro"
        (tentarNovamente)="carregar()"
      >
      </app-error-state>

      <app-empty-state
        *ngIf="!carregando && !erro && candidaturas.length === 0"
        icone="pi pi-send"
        titulo="Nenhuma candidatura"
        descricao="Você ainda não se candidatou a nenhuma vaga.">
      </app-empty-state>

      <div *ngIf="!carregando && !erro && candidaturas.length > 0" class="card">
        <p-table
          [value]="candidaturas"
          styleClass="p-datatable-sm"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[5, 10, 20]"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Vaga</th>
              <th>Empresa</th>
              <th>Protocolo</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-candidatura>
            <tr>
              <td>{{ candidatura.vagaTitulo }}</td>
              <td>{{ candidatura.empresaNome }}</td>
              <td><span style="font-family: monospace;">{{ candidatura.protocolo }}</span></td>
              <td>
                <p-tag
                  [value]="candidatura.contratado ? 'Contratado' : candidatura.entrevistaRealizada ? 'Entrevistado' : 'Pendente'"
                  [severity]="candidatura.contratado ? 'success' : candidatura.entrevistaRealizada ? 'info' : 'warning'"
                >
                </p-tag>
              </td>
              <td>{{ candidatura.createdAt || '' | dataBr }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class MinhasCandidaturasComponent implements OnInit {
  carregando = true;
  erro = false;
  mensagemErro = '';
  candidaturas: CandidaturaResponse[] = [];

  constructor(
    private candidaturaService: CandidaturaService,
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = false;
    this.candidaturaService.listarMinhas()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (dados) => this.candidaturas = dados,
        error: (e) => {
          this.erro = true;
          this.mensagemErro = e.message;
        },
      });
  }
}