import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PerfilDisponivelDto } from '@core/models/auth.models';

/**
 * Modal para seleção de perfil (multi-perfil)
 * Exibido após login quando o usuário tem mais de um perfil
 */
@Component({
  selector: 'app-perfil-selector-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [visible]="visivel"
      [modal]="true"
      [closable]="false"
      [style]="{ width: '500px' }"
      header="Selecione o Perfil de Acesso"
    >
      <div class="perfil-selector">
        <p class="perfil-selector-descricao">
          Você possui mais de um perfil de acesso. Selecione com qual perfil deseja acessar o
          sistema:
        </p>

        <div class="perfil-list">
          <div
            *ngFor="let perfil of perfis"
            class="perfil-card"
            [class.perfil-card-selected]="perfilSelecionado === perfil.perfilCodigo"
            (click)="selecionarPerfil(perfil.perfilCodigo)"
          >
            <div class="perfil-card-header">
              <i [class]="obterIconePerfil(perfil.perfilCodigo)" class="perfil-icon"></i>
              <h3 class="perfil-nome">{{ formatarNomePerfil(perfil.perfilNome) }}</h3>
            </div>

            <p class="perfil-descricao">{{ obterDescricaoPerfil(perfil.perfilCodigo) }}</p>

            <i
              *ngIf="perfilSelecionado === perfil.perfilCodigo"
              class="pi pi-check-circle perfil-check"
            >
            </i>
          </div>
        </div>

        <div class="perfil-actions">
          <p-button
            label="Acessar"
            icon="pi pi-arrow-right"
            [disabled]="!perfilSelecionado"
            [loading]="carregando"
            (onClick)="confirmar.emit(perfilSelecionado!)"
          >
          </p-button>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [
    `
      .perfil-selector {
        padding: 0.5rem 0;
      }

      .perfil-selector-descricao {
        color: var(--text-color-secondary);
        font-size: 0.9375rem;
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }

      .perfil-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }

      .perfil-card {
        display: flex;
        align-items: center;
        padding: 1rem;
        border: 2px solid var(--surface-border);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      }

      .perfil-card:hover {
        border-color: var(--primary-color);
        background: var(--surface-hover);
      }

      .perfil-card-selected {
        border-color: var(--primary-color);
        background: rgba(59, 130, 246, 0.05);
      }

      .perfil-card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
      }

      .perfil-icon {
        font-size: 1.5rem;
        color: var(--primary-color);
      }

      .perfil-nome {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
      }

      .perfil-descricao {
        color: var(--text-color-secondary);
        font-size: 0.8125rem;
        margin: 0;
        margin-left: auto;
        max-width: 200px;
        text-align: right;
      }

      .perfil-check {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        font-size: 1.25rem;
        color: var(--primary-color);
      }

      .perfil-actions {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class PerfilSelectorModalComponent {
  @Input() visivel: boolean = false;
  @Input() perfis: PerfilDisponivelDto[] = [];
  @Input() carregando: boolean = false;

  @Output() confirmar = new EventEmitter<string>();

  perfilSelecionado: string | null = null;

  selecionarPerfil(codigo: string): void {
    this.perfilSelecionado = codigo;
  }

  obterIconePerfil(codigo: string): string {
    const icones: Record<string, string> = {
      ADMIN: 'pi pi-crown',
      GESTOR_EMPRESA: 'pi pi-building',
      RECRUTADOR: 'pi pi-user-plus',
      CANDIDATO: 'pi pi-user',
    };
    return icones[codigo] || 'pi pi-user';
  }

  formatarNomePerfil(nome: string): string {
    const nomes: Record<string, string> = {
      Administrador: 'Administrador',
      'Gestor de Empresa': 'Gestor de Empresa',
      Recrutador: 'Recrutador',
      Candidato: 'Candidato',
    };
    return nomes[nome] || nome;
  }

  obterDescricaoPerfil(codigo: string): string {
    const descricoes: Record<string, string> = {
      ADMIN: 'Acesso total ao sistema',
      GESTOR_EMPRESA: 'Gerencia vagas e equipe',
      RECRUTADOR: 'Gerencia vagas e candidatos',
      CANDIDATO: 'Busca vagas e se candidata',
    };
    return descricoes[codigo] || '';
  }
}
