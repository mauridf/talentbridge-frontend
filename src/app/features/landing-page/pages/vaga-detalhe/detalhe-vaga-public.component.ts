import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { LandingPageService, VagaDetalheLandingPage } from '../../services/landing-page.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalhe-vaga-public',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, DividerModule],
  templateUrl: './detalhe-vaga-public.component.html',
  styleUrls: ['./detalhe-vaga-public.component.scss'],
})
export class DetalheVagaPublicComponent implements OnInit {
  carregando = true;
  erro = false;
  mensagemErro = '';
  vaga?: VagaDetalheLandingPage;
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

  candidatar(): void {
    // Redireciona para registro de candidato
    window.location.href = '/candidatos/registro';
  }
}
