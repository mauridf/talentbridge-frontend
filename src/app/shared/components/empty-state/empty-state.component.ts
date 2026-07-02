import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

/**
 * Componente de estado vazio
 * Exibido quando uma lista/busca não retorna resultados
 *
 * Uso:
 * <app-empty-state
 *   icone="pi pi-inbox"
 *   titulo="Nenhuma vaga encontrada"
 *   descricao="Tente ajustar seus filtros de busca"
 *   textoAcao="Limpar filtros"
 *   (acao)="limparFiltros()">
 * </app-empty-state>
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="empty-state fade-in">
      <!-- Ícone -->
      <div class="empty-state-icon">
        <i [class]="icone" style="font-size: 3rem;"></i>
      </div>

      <!-- Título -->
      <h3 class="empty-state-title">{{ titulo }}</h3>

      <!-- Descrição (opcional) -->
      <p *ngIf="descricao" class="empty-state-description">
        {{ descricao }}
      </p>

      <!-- Ação (opcional) -->
      <p-button
        *ngIf="textoAcao"
        [label]="textoAcao"
        [icon]="iconeAcao"
        styleClass="p-button-outlined"
        (onClick)="acao.emit()"
      >
      </p-button>

      <!-- Imagem decorativa (opcional) -->
      <img *ngIf="imagem" [src]="imagem" [alt]="titulo" class="empty-state-image" />
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        text-align: center;
        min-height: 300px;
      }

      .empty-state-icon {
        color: var(--primary-color);
        margin-bottom: 1rem;
        opacity: 0.7;
      }

      .empty-state-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.5rem;
      }

      .empty-state-description {
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        max-width: 400px;
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }

      .empty-state-image {
        max-width: 200px;
        margin-top: 1rem;
        opacity: 0.8;
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
export class EmptyStateComponent {
  /** Ícone PrimeNG a ser exibido (ex: 'pi pi-inbox') */
  @Input() icone: string = 'pi pi-inbox';

  /** Título principal */
  @Input() titulo: string = 'Nenhum registro encontrado';

  /** Descrição complementar */
  @Input() descricao: string = '';

  /** Texto do botão de ação */
  @Input() textoAcao: string = '';

  /** Ícone do botão de ação */
  @Input() iconeAcao: string = 'pi pi-refresh';

  /** URL da imagem decorativa (opcional) */
  @Input() imagem: string = '';

  /** Evento emitido ao clicar no botão de ação */
  @Output() acao = new EventEmitter<void>();
}
