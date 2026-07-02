import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

/**
 * Componente de estado de erro
 * Exibido quando ocorre falha ao carregar dados
 * Oferece opção de tentar novamente
 *
 * Uso:
 * <app-error-state
 *   mensagem="Erro ao carregar vagas"
 *   (tentarNovamente)="recarregar()">
 * </app-error-state>
 */
@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="error-state fade-in">
      <!-- Ícone de erro -->
      <div class="error-state-icon">
        <i class="pi pi-exclamation-triangle"></i>
      </div>

      <!-- Título -->
      <h3 class="error-state-title">Ops! Algo deu errado</h3>

      <!-- Mensagem -->
      <p class="error-state-message">
        {{ mensagem }}
      </p>

      <!-- Detalhes técnicos (opcional, para debug) -->
      <details *ngIf="detalhesTecnicos" class="error-state-details">
        <summary>Detalhes técnicos</summary>
        <pre>{{ detalhesTecnicos }}</pre>
      </details>

      <!-- Botão de tentar novamente -->
      <p-button
        *ngIf="tentarNovamente.observed"
        label="Tentar Novamente"
        icon="pi pi-refresh"
        styleClass="p-button-outlined"
        (onClick)="tentarNovamente.emit()"
      >
      </p-button>

      <!-- Botão de voltar -->
      <p-button
        *ngIf="textoVoltar"
        [label]="textoVoltar"
        icon="pi pi-arrow-left"
        styleClass="p-button-text"
        (onClick)="voltar.emit()"
      >
      </p-button>
    </div>
  `,
  styles: [
    `
      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        text-align: center;
        min-height: 300px;
      }

      .error-state-icon {
        font-size: 3rem;
        color: var(--danger-color);
        margin-bottom: 1rem;
      }

      .error-state-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.5rem;
      }

      .error-state-message {
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        max-width: 400px;
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }

      .error-state-details {
        text-align: left;
        max-width: 400px;
        margin-bottom: 1rem;
        font-size: 0.75rem;
        color: var(--text-color-secondary);
      }

      .error-state-details pre {
        background: var(--surface-ground);
        padding: 0.5rem;
        border-radius: 4px;
        overflow-x: auto;
        font-family: monospace;
        font-size: 0.75rem;
        margin-top: 0.5rem;
      }

      .error-state-details summary {
        cursor: pointer;
        color: var(--primary-color);
      }

      .fade-in {
        animation: fadeIn 0.3s ease-in;
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
export class ErrorStateComponent {
  /** Mensagem de erro amigável */
  @Input() mensagem: string = 'Ocorreu um erro ao carregar os dados. Tente novamente.';

  /** Detalhes técnicos para debug (opcional) */
  @Input() detalhesTecnicos: string = '';

  /** Texto do botão de voltar (se não informado, não exibe) */
  @Input() textoVoltar: string = '';

  /** Evento ao clicar em "Tentar Novamente" */
  @Output() tentarNovamente = new EventEmitter<void>();

  /** Evento ao clicar em "Voltar" */
  @Output() voltar = new EventEmitter<void>();
}
