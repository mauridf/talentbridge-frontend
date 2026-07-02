import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-convites',
  standalone: true,
  imports: [CommonModule, CardModule, PageHeaderComponent],
  template: `
    <div class="page-container fade-in">
      <app-page-header
        titulo="Gerenciar Convites"
        subtitulo="Criação e gestão de convites para empresas"
        [mostrarVoltar]="true"
      >
      </app-page-header>

      <div class="card" style="text-align: center; padding: 3rem;">
        <i
          class="pi pi-envelope"
          style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"
        ></i>
        <h3>Gerenciamento de Convites</h3>
        <p style="color: var(--text-color-secondary);">Funcionalidade em desenvolvimento.</p>
      </div>
    </div>
  `,
})
export class AdminConvitesComponent {}
