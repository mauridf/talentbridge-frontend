import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

/**
 * Cabeçalho de página padronizado
 * Usado em todas as páginas para manter consistência visual
 *
 * Uso:
 * <app-page-header
 *   titulo="Minhas Vagas"
 *   subtitulo="Gerencie todas as vagas da sua empresa"
 *   textoBotao="Nova Vaga"
 *   iconeBotao="pi pi-plus"
 *   (acaoBotao)="abrirFormulario()">
 *   <ng-template #acoes>
 *     <p-button label="Exportar" icon="pi pi-download"></p-button>
 *   </ng-template>
 * </app-page-header>
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="page-header">
      <div class="page-header-left">
        <!-- Botão voltar (opcional) -->
        <button *ngIf="mostrarVoltar" class="page-header-back" (click)="voltar.emit()">
          <i class="pi pi-arrow-left"></i>
        </button>

        <div class="page-header-text">
          <h1 class="page-header-title">{{ titulo }}</h1>
          <p *ngIf="subtitulo" class="page-header-subtitle">{{ subtitulo }}</p>
        </div>
      </div>

      <div class="page-header-right">
        <!-- Ações customizadas (template) -->
        <ng-content></ng-content>

        <!-- Botão principal (opcional) -->
        <p-button
          *ngIf="textoBotao"
          [label]="textoBotao"
          [icon]="iconeBotao"
          [loading]="botaoCarregando"
          (onClick)="acaoBotao.emit()"
        >
        </p-button>
      </div>
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--surface-border);
      }

      .page-header-left {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .page-header-back {
        background: none;
        border: none;
        color: var(--text-color-secondary);
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: all 0.2s;
        margin-top: 0.25rem;
      }

      .page-header-back:hover {
        background: var(--surface-hover);
        color: var(--primary-color);
      }

      .page-header-text {
        display: flex;
        flex-direction: column;
      }

      .page-header-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
        margin: 0;
        line-height: 1.3;
      }

      .page-header-subtitle {
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        margin: 0.25rem 0 0 0;
      }

      .page-header-right {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-shrink: 0;
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          gap: 1rem;
        }

        .page-header-right {
          width: 100%;
          justify-content: flex-end;
        }

        .page-header-title {
          font-size: 1.25rem;
        }
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() textoBotao: string = '';
  @Input() iconeBotao: string = 'pi pi-plus';
  @Input() mostrarVoltar: boolean = false;
  @Input() botaoCarregando: boolean = false;

  @Output() acaoBotao = new EventEmitter<void>();
  @Output() voltar = new EventEmitter<void>();
}
