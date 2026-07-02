import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-gerenciar-creditos',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <div class="page-container fade-in">
      <app-page-header
        titulo="Gerenciar Créditos"
        subtitulo="Adicionar e remover créditos de empresas"
        [mostrarVoltar]="true"
      ></app-page-header>
      <div class="card" style="text-align: center; padding: 3rem;">
        <i
          class="pi pi-wallet"
          style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"
        ></i>
        <h3>Gerenciamento de Créditos</h3>
        <p style="color: var(--text-color-secondary);">Funcionalidade em desenvolvimento.</p>
      </div>
    </div>
  `,
})
export class GerenciarCreditosComponent {}
