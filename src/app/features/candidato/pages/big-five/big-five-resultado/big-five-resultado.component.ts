import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-big-five-resultado',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, ChartModule],
  template: `
    <div class="page-container fade-in" style="max-width: 800px; margin: 0 auto;">
      <div class="card" style="text-align: center; padding: 3rem;">
        <i
          class="pi pi-chart-bar"
          style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"
        ></i>
        <h2>Resultado do Big Five</h2>
        <p style="color: var(--text-color-secondary); margin-bottom: 1.5rem;">
          O resultado completo do seu teste comportamental será exibido aqui.
        </p>
        <p-button
          label="Voltar ao Dashboard"
          icon="pi pi-arrow-left"
          routerLink="/candidatos/dashboard"
        >
        </p-button>
      </div>
    </div>
  `,
})
export class BigFiveResultadoComponent {}
