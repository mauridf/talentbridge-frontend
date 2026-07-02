import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {
  LandingPageService,
  EmpresaLandingPage,
  VagaLandingPage,
} from '../../services/landing-page.service';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-lista-vagas-public',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, TagModule, InputTextModule],
  templateUrl: './lista-vagas-public.component.html',
  styleUrls: ['./lista-vagas-public.component.scss'],
})
export class ListaVagasPublicComponent implements OnInit, OnDestroy {
  carregando = true;
  erro = false;
  mensagemErro = '';

  empresa?: EmpresaLandingPage;
  vagas: VagaLandingPage[] = [];
  vagasFiltradas: VagaLandingPage[] = [];
  termoBusca = '';

  slug = '';

  private destroy$ = new Subject<void>();

  constructor(
    private landingPageService: LandingPageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.carregarPagina();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarPagina(): void {
    if (!this.slug) {
      this.erro = true;
      this.mensagemErro = 'Empresa não especificada.';
      this.carregando = false;
      return;
    }

    this.carregando = true;
    this.erro = false;

    this.landingPageService
      .buscarEmpresaPorSlug(this.slug)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.carregando = false)),
      )
      .subscribe({
        next: (empresa) => {
          this.empresa = empresa;
          this.carregarVagas(empresa.id);
        },
        error: (error) => {
          this.erro = true;
          this.mensagemErro = error.message || 'Empresa não encontrada.';
        },
      });
  }

  private carregarVagas(empresaId: string): void {
    this.carregando = true;

    this.landingPageService
      .obterLandingPage(empresaId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.carregando = false)),
      )
      .subscribe({
        next: (data) => {
          this.empresa = data.empresa;
          this.vagas = data.vagas;
          this.vagasFiltradas = data.vagas;
        },
        error: (error) => {
          this.erro = true;
          this.mensagemErro = error.message || 'Erro ao carregar vagas.';
        },
      });
  }

  /**
   * Filtra vagas pelo termo de busca
   */
  filtrarVagas(): void {
    if (!this.termoBusca.trim()) {
      this.vagasFiltradas = this.vagas;
      return;
    }

    const termo = this.termoBusca.toLowerCase();
    this.vagasFiltradas = this.vagas.filter(
      (vaga) =>
        vaga.titulo.toLowerCase().includes(termo) ||
        vaga.cargo.toLowerCase().includes(termo) ||
        vaga.cidade.toLowerCase().includes(termo),
    );
  }

  /**
   * Obtém texto amigável do regime de trabalho
   */
  getRegimeTexto(regime: string): string {
    const map: Record<string, string> = {
      CLT: 'CLT',
      PJ: 'PJ',
      Estágio: 'Estágio',
      Temporário: 'Temporário',
    };
    return map[regime] || regime;
  }
}
