import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { DataBrPipe } from '../../../../shared/pipes/data-br.pipe';
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

  constructor(
    private landingPageService: LandingPageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
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
   * Redireciona para página de registro de candidato
   */
  candidatar(): void {
    window.location.href = '/candidatos/registro';
  }
}
