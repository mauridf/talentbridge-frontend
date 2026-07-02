import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

/**
 * Diálogo de confirmação reutilizável
 *
 * Uso:
 * <app-confirm-dialog
 *   [visivel]="mostrarDialog"
 *   titulo="Confirmar exclusão"
 *   mensagem="Tem certeza que deseja excluir esta vaga?"
 *   textoConfirmar="Sim, excluir"
 *   textoCancelar="Cancelar"
 *   (confirmar)="excluirVaga()"
 *   (cancelar)="mostrarDialog = false">
 * </app-confirm-dialog>
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [visible]="visivel"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '450px' }"
      [header]="titulo"
      (onHide)="cancelar.emit()"
    >
      <div class="confirm-dialog-content">
        <i [class]="icone" class="confirm-dialog-icon" [ngClass]="iconClass"></i>
        <p class="confirm-dialog-message">{{ mensagem }}</p>
      </div>

      <ng-template pTemplate="footer">
        <div class="confirm-dialog-footer">
          <p-button
            [label]="textoCancelar"
            styleClass="p-button-text p-button-secondary"
            (onClick)="cancelar.emit()"
          >
          </p-button>

          <p-button
            [label]="textoConfirmar"
            [styleClass]="confirmButtonClass"
            [icon]="iconeConfirmar"
            [loading]="carregando"
            (onClick)="confirmar.emit()"
          >
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .confirm-dialog-content {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem 0;
      }

      .confirm-dialog-icon {
        font-size: 1.5rem;
        margin-top: 0.125rem;
      }

      .icon-warn {
        color: var(--warning-color);
      }

      .icon-danger {
        color: var(--danger-color);
      }

      .icon-info {
        color: var(--primary-color);
      }

      .confirm-dialog-message {
        color: var(--text-color);
        font-size: 0.9375rem;
        line-height: 1.5;
        margin: 0;
      }

      .confirm-dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  /** Controla visibilidade do diálogo */
  @Input() visivel: boolean = false;

  /** Título do diálogo */
  @Input() titulo: string = 'Confirmar';

  /** Mensagem de confirmação */
  @Input() mensagem: string = 'Tem certeza?';

  /** Texto do botão de confirmar */
  @Input() textoConfirmar: string = 'Confirmar';

  /** Texto do botão de cancelar */
  @Input() textoCancelar: string = 'Cancelar';

  /** Ícone do diálogo (PrimeNG icon class) */
  @Input() icone: string = 'pi pi-question-circle';

  /** Ícone do botão confirmar */
  @Input() iconeConfirmar: string = 'pi pi-check';

  /** Tipo do diálogo: 'warn', 'danger', 'info' */
  @Input() tipo: 'warn' | 'danger' | 'info' = 'warn';

  /** Mostrar loading no botão confirmar */
  @Input() carregando: boolean = false;

  /** Evento ao confirmar */
  @Output() confirmar = new EventEmitter<void>();

  /** Evento ao cancelar */
  @Output() cancelar = new EventEmitter<void>();

  /** Classe CSS dinâmica para o ícone baseado no tipo */
  get iconClass(): string {
    switch (this.tipo) {
      case 'warn':
        return 'icon-warn';
      case 'danger':
        return 'icon-danger';
      case 'info':
        return 'icon-info';
      default:
        return 'icon-warn';
    }
  }

  /** Classe CSS dinâmica para o botão confirmar */
  get confirmButtonClass(): string {
    switch (this.tipo) {
      case 'warn':
        return 'p-button-warning';
      case 'danger':
        return 'p-button-danger';
      case 'info':
        return 'p-button-primary';
      default:
        return 'p-button-primary';
    }
  }
}
