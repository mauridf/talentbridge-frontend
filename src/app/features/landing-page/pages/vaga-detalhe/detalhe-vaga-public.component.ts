import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';
import { TokenService } from '../../../../core/services/token.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PerfilUsuario } from '../../../../core/models/auth.models';
import { LandingPageService, VagaDetalheLandingPage } from '../../services/landing-page.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalhe-vaga-public',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    ButtonModule,
    CardModule,
    TagModule,
    DividerModule,
    LoadingSpinnerComponent,
    ErrorStateComponent,
    DataBrPipe,
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

  // Estados de candidatura
  candidatando = false;
  jaCandidatado = false;
  isCandidato = false;
  estaLogado = false;

  constructor(
    private landingPageService: LandingPageService,
    private tokenService: TokenService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    const vagaId = this.route.snapshot.paramMap.get('id') || '';

    // Verifica estado de autenticação
    this.verificarAutenticacao();

    if (vagaId) {
      this.carregarVaga(vagaId);
    } else {
      this.erro = true;
      this.mensagemErro = 'Vaga não especificada.';
      this.carregando = false;
    }
  }

  /**
   * Verifica se o usuário está logado e qual seu perfil
   */
  private verificarAutenticacao(): void {
    const claims = this.tokenService.obterClaims();

    if (claims && !this.tokenService.isTokenExpirado()) {
      this.estaLogado = true;
      this.isCandidato = claims.perfil === PerfilUsuario.CANDIDATO;
    } else {
      this.estaLogado = false;
      this.isCandidato = false;
    }
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
        },
        error: (error) => {
          this.erro = true;
          this.mensagemErro = error.message || 'Vaga não encontrada.';
        },
      });
  }

  /**
   * Converte string de atividades separadas por ; em array
   */
  get atividadesList(): string[] {
    if (!this.vaga?.atividades) return [];
    return this.vaga.atividades.split(';').filter((a) => a.trim());
  }

  /**
   * Converte string de benefícios separados por ; em array
   */
  get beneficiosList(): string[] {
    if (!this.vaga?.beneficios) return [];
    return this.vaga.beneficios.split(';').filter((b) => b.trim());
  }

  /**
   * Ação de candidatura
   */
  candidatar(): void {
    // Se não estiver logado, redireciona para registro
    if (!this.estaLogado) {
      this.router.navigate(['/candidatos/registro']);
      return;
    }

    // Se estiver logado mas não for candidato
    if (!this.isCandidato) {
      this.notificationService.warn(
        'Acesso Restrito',
        'Apenas usuários com perfil de candidato podem se candidatar a vagas.',
      );
      return;
    }

    // Se já está candidatado
    if (this.jaCandidatado) {
      this.notificationService.info('Candidatura Realizada', 'Você já se candidatou a esta vaga.');
      return;
    }

    // Simula candidatura
    this.candidatando = true;

    setTimeout(() => {
      this.candidatando = false;
      this.jaCandidatado = true;
      this.notificationService.success(
        'Candidatura Realizada!',
        'Você se candidatou a esta vaga com sucesso. Acompanhe o status pelo seu dashboard.',
      );
    }, 1500);
  }
}
