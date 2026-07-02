import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingSkeletonComponent } from '../../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { DataBrPipe } from '../../../../../shared/pipes/data-br.pipe';
import { NotificationService } from '../../../../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { ResultadoDto } from '../../../../../core/models/resultado.dto';
import { Subject, takeUntil, finalize } from 'rxjs';
import { map } from 'rxjs/operators';

interface CandidaturaResponse {
  id: string;
  vagaId: string;
  vagaTitulo: string;
  empresaNome: string;
  candidatoId: string;
  candidatoNome: string;
  candidatoEmail: string;
  protocolo: string;
  contratado: boolean;
  entrevistaRealizada: boolean;
  dataHoraEntrevista?: string;
  createdAt: string;
}

@Component({
  selector: 'app-lista-candidaturas',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TagModule,
    TableModule,
    TooltipModule,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    DataBrPipe,
  ],
  templateUrl: './lista-candidaturas.component.html',
  styleUrls: ['./lista-candidaturas.component.scss'],
})
export class ListaCandidaturasComponent implements OnInit, OnDestroy {
  carregando = true;
  erro = false;
  mensagemErro = '';

  candidaturas: CandidaturaResponse[] = [];
  vagaId = '';
  vagaTitulo = '';

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.vagaId = this.route.snapshot.paramMap.get('vagaId') || '';
    this.carregarCandidaturas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarCandidaturas(): void {
    if (!this.vagaId) {
      this.erro = true;
      this.mensagemErro = 'ID da vaga não encontrado.';
      return;
    }

    this.carregando = true;
    this.erro = false;

    this.http
      .get<ResultadoDto<CandidaturaResponse[]>>(
        `${environment.apiUrl}/Candidatura/vaga/${this.vagaId}`,
      )
      .pipe(
        takeUntil(this.destroy$),
        map((response) => {
          if (!response.sucesso || !response.valor) {
            throw new Error(response.erros?.[0]?.mensagem || 'Erro ao carregar candidaturas');
          }
          return response.valor;
        }),
        finalize(() => (this.carregando = false)),
      )
      .subscribe({
        next: (data) => {
          this.candidaturas = data;
          if (data.length > 0) {
            this.vagaTitulo = data[0].vagaTitulo;
          }
        },
        error: (error) => {
          this.erro = true;
          this.mensagemErro = error.message || 'Erro ao carregar candidaturas.';
        },
      });
  }

  getStatusSeverity(
    candidatura: CandidaturaResponse,
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    if (candidatura.contratado) return 'success';
    if (candidatura.entrevistaRealizada) return 'info';
    return 'secondary';
  }

  getStatusTexto(candidatura: CandidaturaResponse): string {
    if (candidatura.contratado) return 'Contratado';
    if (candidatura.entrevistaRealizada) return 'Entrevistado';
    return 'Em Análise';
  }

  agendarEntrevista(candidatura: CandidaturaResponse): void {
    // Implementação futura - abrir modal de agendamento
    this.notificationService.info('Em breve', 'Funcionalidade de agendamento em desenvolvimento.');
  }

  contratar(candidatura: CandidaturaResponse): void {
    this.notificationService.info('Em breve', 'Funcionalidade de contratação em desenvolvimento.');
  }
}
