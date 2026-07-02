import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { LoadingSkeletonComponent } from '../../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataBrPipe } from '../../../../../shared/pipes/data-br.pipe';
import { VagaService, VagaResponse } from '../../../services/vaga.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-vaga-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    CardModule,
    TagModule,
    TableModule,
    TooltipModule,
    ConfirmDialogModule,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    DataBrPipe,
  ],
  providers: [ConfirmationService],
  templateUrl: './vaga-list.component.html',
  styleUrls: ['./vaga-list.component.scss'],
})
export class VagaListComponent implements OnInit, OnDestroy {
  carregando = true;
  erro = false;
  mensagemErro = '';

  vagas: VagaResponse[] = [];
  totalRegistros = 0;
  pageNumber = 1;
  pageSize = 10;

  private destroy$ = new Subject<void>();

  constructor(
    private vagaService: VagaService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.carregarVagas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarVagas(): void {
    this.carregando = true;
    this.erro = false;

    this.vagaService
      .buscarPorEmpresa(this.pageNumber, this.pageSize)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.carregando = false)),
      )
      .subscribe({
        next: (response) => {
          this.vagas = response.data;
          this.totalRegistros = response.metaData.totalCount;
        },
        error: (error) => {
          this.erro = true;
          this.mensagemErro = error.message || 'Erro ao carregar vagas';
        },
      });
  }

  onPageChange(event: any): void {
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.carregarVagas();
  }

  confirmarEncerrar(vaga: VagaResponse): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja encerrar a vaga "${vaga.titulo}"?`,
      header: 'Encerrar Vaga',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, encerrar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.vagaService.encerrar(vaga.id).subscribe({
          next: () => {
            this.notificationService.success('Sucesso!', 'Vaga encerrada com sucesso.');
            this.carregarVagas();
          },
          error: (error) => {
            this.notificationService.error('Erro', error.message || 'Erro ao encerrar vaga.');
          },
        });
      },
    });
  }

  confirmarReativar(vaga: VagaResponse): void {
    this.confirmationService.confirm({
      message: `Deseja reativar a vaga "${vaga.titulo}"?`,
      header: 'Reativar Vaga',
      icon: 'pi pi-refresh',
      acceptLabel: 'Sim, reativar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.vagaService.reativar(vaga.id).subscribe({
          next: () => {
            this.notificationService.success('Sucesso!', 'Vaga reativada com sucesso.');
            this.carregarVagas();
          },
          error: (error) => {
            this.notificationService.error('Erro', error.message || 'Erro ao reativar vaga.');
          },
        });
      },
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status?.toLowerCase()) {
      case 'aberta':
        return 'success';
      case 'encerrada':
        return 'danger';
      case 'pausada':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getStatusTexto(status: string): string {
    const map: Record<string, string> = {
      aberta: 'Aberta',
      encerrada: 'Encerrada',
      pausada: 'Pausada',
    };
    return map[status] || status;
  }

  isVencimentoProximo(dataFim: string): boolean {
    if (!dataFim) return false;
    const data = new Date(dataFim);
    const agora = new Date();
    const diffDias = Math.ceil((data.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias <= 7 && diffDias > 0;
  }
}
