import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';
import { LandingPageService, VagaDetalheLandingPage } from '../../services/landing-page.service';
import { CandidaturaService } from '../../../../core/services/candidatura.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TokenService } from '../../../../core/services/token.service';
import { PerfilUsuario } from '../../../../core/models/auth.models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalhe-vaga-public',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterModule, ButtonModule, CardModule,
    TagModule, DividerModule, LoadingSpinnerComponent, ErrorStateComponent, DataBrPipe,
  ],
  templateUrl: './detalhe-vaga-public.component.html',
  styleUrls: ['./detalhe-vaga-public.component.scss'],
})
export class DetalheVagaPublicComponent implements OnInit {
  carregando = true;
  erro = false;
  mensagemErro = '';
  vaga: VagaDetalheLandingPage | null = null;
  slug = '';

  estaLogado = false;
  isCandidato = false;
  jaCandidatado = false;
  candidatando = false;

  constructor(
    private landingPageService: LandingPageService,
    private candidaturaService: CandidaturaService,
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.verificarAutenticacao();
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    const vagaId = this.route.snapshot.paramMap.get('id') || '';
    if (vagaId) {
      this.carregarVaga(vagaId);
    } else {
      this.erro = true;
      this.mensagemErro = 'Vaga não especificada.';
      this.carregando = false;
    }
  }

  private verificarAutenticacao(): void {
    const claims = this.tokenService.obterClaims();
    this.estaLogado = !!claims;
    this.isCandidato = claims?.perfil === PerfilUsuario.CANDIDATO;
  }

  carregarVaga(vagaId: string): void {
    this.carregando = true;
    this.erro = false;
    this.landingPageService
      .obterDetalheVaga(vagaId)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (data) => {
          this.vaga = data;
          if (this.isCandidato) {
            this.verificarCandidatura(vagaId);
          }
        },
        error: (error) => {
          this.erro = true;
          this.mensagemErro = error.message || 'Vaga não encontrada.';
        },
      });
  }

  private verificarCandidatura(vagaId: string): void {
    this.candidaturaService.verificar(vagaId).subscribe({
      next: (jaCandidatado) => this.jaCandidatado = jaCandidatado,
    });
  }

  get atividadesList(): string[] {
    if (!this.vaga?.atividades) return [];
    return this.vaga.atividades.split(';').filter((a) => a.trim());
  }

  get beneficiosList(): string[] {
    if (!this.vaga?.beneficios) return [];
    return this.vaga.beneficios.split(';').filter((b) => b.trim());
  }

  candidatar(): void {
    if (!this.estaLogado) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
    if (!this.isCandidato) {
      this.notificationService.warn('Apenas candidatos podem se candidatar', 'Faça login com uma conta de candidato.');
      return;
    }
    if (!this.vaga) return;
    this.candidatando = true;
    this.candidaturaService.criar({ vagaId: this.vaga.id })
      .pipe(finalize(() => this.candidatando = false))
      .subscribe({
        next: () => {
          this.jaCandidatado = true;
          this.notificationService.success('Candidatura realizada com sucesso!', '');
        },
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }
}