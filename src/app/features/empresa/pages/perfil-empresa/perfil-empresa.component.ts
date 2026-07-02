import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TokenService } from '@core/services/token.service';
import { CreditoService, CreditosResponse } from '@core/services/credito.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-perfil-empresa',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, PageHeaderComponent],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Perfil da Empresa" subtitulo="Informações e créditos"></app-page-header>

      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="card text-center">
            <i class="pi pi-building" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
            <h3>{{ empresaNome }}</h3>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="card">
            <h4>Créditos Disponíveis</h4>
            @if (carregandoCreditos) {
              <p>Carregando...</p>
            } @else if (creditos) {
              <div class="grid text-center">
                <div class="col-4">
                  <span style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">{{ creditos.totalCreditos }}</span>
                  <p style="color: var(--text-color-secondary);">Total</p>
                </div>
                <div class="col-4">
                  <span style="font-size: 2rem; font-weight: 700; color: var(--orange-500);">{{ creditos.creditosUsados }}</span>
                  <p style="color: var(--text-color-secondary);">Usados</p>
                </div>
                <div class="col-4">
                  <span style="font-size: 2rem; font-weight: 700; color: var(--green-500);">{{ creditos.creditosDisponiveis }}</span>
                  <p style="color: var(--text-color-secondary);">Disponíveis</p>
                </div>
              </div>
            } @else {
              <p style="color: var(--text-color-secondary);">Não foi possível carregar saldo.</p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PerfilEmpresaComponent implements OnInit {
  empresaNome = '';
  empresaId = '';
  creditos: CreditosResponse | null = null;
  carregandoCreditos = true;

  constructor(
    private tokenService: TokenService,
    private creditoService: CreditoService,
  ) {}

  ngOnInit(): void {
    const claims = this.tokenService.obterClaims();
    this.empresaNome = claims?.nome || 'Empresa';
    this.empresaId = claims?.idEmpresa || '';
    if (this.empresaId) {
      this.creditoService.saldoEmpresa(this.empresaId)
        .pipe(finalize(() => this.carregandoCreditos = false))
        .subscribe({
          next: (c) => this.creditos = c,
          error: () => this.carregandoCreditos = false,
        });
    } else {
      this.carregandoCreditos = false;
    }
  }
}