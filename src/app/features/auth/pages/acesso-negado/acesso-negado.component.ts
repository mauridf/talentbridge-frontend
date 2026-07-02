import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="acesso-negado-page">
      <div class="acesso-negado-content">
        <div class="acesso-negado-icon">
          <i class="pi pi-lock"></i>
        </div>

        <h1>Acesso Negado</h1>

        <p>
          Você não tem permissão para acessar esta área. Entre em contato com o administrador do
          sistema se achar que isso é um erro.
        </p>

        <div class="acesso-negado-actions">
          <p-button label="Voltar ao Início" icon="pi pi-home" (onClick)="voltarInicio()">
          </p-button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .acesso-negado-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: var(--surface-ground);
      }

      .acesso-negado-content {
        text-align: center;
        max-width: 500px;
        padding: 2rem;
      }

      .acesso-negado-icon {
        font-size: 4rem;
        color: var(--danger-color);
        margin-bottom: 1.5rem;
      }

      h1 {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
      }

      p {
        color: var(--text-color-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }
    `,
  ],
})
export class AcessoNegadoComponent {
  constructor(private router: Router) {}

  voltarInicio(): void {
    this.router.navigate(['/']);
  }
}
