import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

/**
 * Componente de loading spinner global
 * Usado para indicar carregamento de páginas inteiras ou operações bloqueantes
 *
 * Uso:
 * <app-loading-spinner [mensagem]="'Carregando vagas...'"></app-loading-spinner>
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="loading-overlay">
      <div class="loading-content">
        <p-progressSpinner
          strokeWidth="4"
          animationDuration="0.8s"
          [style]="{ width: '50px', height: '50px' }"
        >
        </p-progressSpinner>

        <p *ngIf="mensagem" class="loading-message fade-in">
          {{ mensagem }}
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        padding: 2rem;
      }

      .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .loading-message {
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        text-align: center;
        margin: 0;
      }

      .fade-in {
        animation: fadeIn 0.5s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  @Input() mensagem: string = 'Carregando...';
}
