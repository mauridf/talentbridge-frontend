import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { finalize } from 'rxjs';
import { CandidatoService, CandidatoResponse, PerfilPessoalResponse, PerfilProfissionalResponse } from '../../../candidato/services/candidato.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-perfil-candidato-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, TagModule, ChartModule, DividerModule, PageHeaderComponent],
  template: `
    <div class="page-container fade-in">
      <app-page-header [titulo]="'Perfil do Candidato'" [subtitulo]="candidato?.nome || 'Carregando...'" [mostrarVoltar]="true">
      </app-page-header>

      @if (carregando) {
        <p-card><p class="text-center">Carregando...</p></p-card>
      } @else {
        <div class="grid">
          <!-- Dados Básicos -->
          <div class="col-12 md:col-4">
            <div class="card text-center">
              <div class="flex justify-content-center mb-3">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--primary-color); display: flex; align-items: center; justify-content: center;">
                  <i class="pi pi-user" style="font-size: 2rem; color: white;"></i>
                </div>
              </div>
              <h3>{{ candidato?.nome }}</h3>
              <p style="color: var(--text-color-secondary);">{{ candidato?.email }}</p>
              <p-tag [value]="candidato?.realizouBigFive ? 'Big Five Realizado' : 'Big Five Pendente'"
                [severity]="candidato?.realizouBigFive ? 'success' : 'warning'">
              </p-tag>
            </div>

            @if (perfilPessoal) {
              <div class="card">
                <h4>Informações Pessoais</h4>
                <div class="info-row"><strong>Sobre:</strong><p>{{ perfilPessoal.sobreMim || 'Não informado' }}</p></div>
                <div class="info-row"><strong>Local:</strong><p>{{ perfilPessoal.localResidencia || 'Não informado' }}</p></div>
                @if (perfilPessoal.endereco) {
                  <div class="info-row"><strong>Endereço:</strong><p>{{ perfilPessoal.endereco.cidade }}/{{ perfilPessoal.endereco.estado }}</p></div>
                }
                @if (perfilPessoal.linkedin) {
                  <div class="info-row"><strong>LinkedIn:</strong><p>{{ perfilPessoal.linkedin }}</p></div>
                }
              </div>
            }
          </div>

          <!-- Perfil Profissional -->
          <div class="col-12 md:col-8">
            @if (perfilProfissional) {
              <!-- Formações -->
              <div class="card mb-3">
                <h4><i class="pi pi-book mr-2"></i>Formação Acadêmica</h4>
                @if (perfilProfissional.formacoesAcademicas?.length) {
                  @for (f of perfilProfissional.formacoesAcademicas; track $index) {
                    <div class="info-row">
                      <strong>{{ f.grau || 'Não especificado' }}</strong>
                      <p>{{ f.areaAtuacao }} @if (f.concluido) {<p-tag value="Concluído" severity="success" styleClass="ml-2"></p-tag>}</p>
                    </div>
                  }
                } @else {
                  <p style="color: var(--text-color-secondary);">Nenhuma formação cadastrada.</p>
                }
              </div>

              <!-- Experiências -->
              <div class="card mb-3">
                <h4><i class="pi pi-briefcase mr-2"></i>Experiências Profissionais</h4>
                @if (perfilProfissional.experienciasProfissionais?.length) {
                  @for (e of perfilProfissional.experienciasProfissionais; track $index) {
                    <div class="info-row">
                      <strong>{{ e.posicao || 'Cargo não especificado' }}</strong>
                      <p>{{ e.empresa }} — {{ e.dataInicio | date:'MM/yyyy' }} a {{ e.empregoAtual ? 'Atual' : (e.dataFim | date:'MM/yyyy') }}</p>
                    </div>
                  }
                } @else {
                  <p style="color: var(--text-color-secondary);">Nenhuma experiência cadastrada.</p>
                }
              </div>

              <!-- Competências -->
              @if (perfilProfissional.competencias?.length) {
                <div class="card mb-3">
                  <h4><i class="pi pi-code mr-2"></i>Competências</h4>
                  <div class="flex gap-2 flex-wrap">
                    @for (c of perfilProfissional.competencias; track $index) {
                      <p-tag [value]="'Nível ' + c.nivel" severity="info"></p-tag>
                    }
                  </div>
                </div>
              }
            } @else {
              <p-card><p class="text-center">Perfil profissional não preenchido.</p></p-card>
            }

            <div class="flex gap-2 justify-content-end">
              <p-button label="Voltar para Candidaturas" icon="pi pi-arrow-left" severity="secondary" (onClick)="voltar()"></p-button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .mb-3 { margin-bottom: 1rem; }
    .info-row { margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--surface-border); }
    .info-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .info-row p { margin: 0.25rem 0 0; color: var(--text-color-secondary); }
    .info-row strong { font-size: 0.9rem; }
    .mr-2 { margin-right: 0.5rem; }
  `]
})
export class PerfilCandidatoDetalheComponent implements OnInit {
  carregando = true;
  candidato: CandidatoResponse | null = null;
  perfilPessoal: PerfilPessoalResponse | null = null;
  perfilProfissional: PerfilProfissionalResponse | null = null;

  candidatoId = '';
  vagaId = '';

  constructor(
    private route: ActivatedRoute,
    private candidatoService: CandidatoService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.candidatoId = this.route.snapshot.paramMap.get('id') || '';
    this.vagaId = this.route.snapshot.paramMap.get('vaga') || '';
    this.carregarDados();
  }

  private carregarDados(): void {
    if (!this.candidatoId) {
      this.carregando = false;
      return;
    }

    this.candidatoService.buscar(this.candidatoId).subscribe({
      next: (c) => {
        this.candidato = c;
        this.carregarPerfis();
      },
      error: (e) => {
        this.carregando = false;
        this.notificationService.error('Erro', e.message);
      },
    });
  }

  private carregarPerfis(): void {
    this.candidatoService.obterPerfilPessoal()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (p) => this.perfilPessoal = p,
        error: () => {},
      });

    this.candidatoService.obterPerfilProfissional()
      .subscribe({
        next: (p) => this.perfilProfissional = p,
        error: () => {},
      });
  }

  voltar(): void {
    window.history.back();
  }
}