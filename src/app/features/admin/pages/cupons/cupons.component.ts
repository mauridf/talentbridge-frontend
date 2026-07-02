import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-cupons',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <div class="page-container fade-in">
      <app-page-header
        titulo="Gerenciar Cupons"
        subtitulo="Criação e gestão de cupons de desconto"
        [mostrarVoltar]="true"
      ></app-page-header>
      <div class="card" style="text-align: center; padding: 3rem;">
        <i
          class="pi pi-ticket"
          style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"
        ></i>
        <h3>Gerenciamento de Cupons</h3>
        <p style="color: var(--text-color-secondary);">Funcionalidade em desenvolvimento.</p>
      </div>
    </div>
  `,
})
export class CuponsComponent {}
