import { Injectable, signal } from '@angular/core';

/**
 * Tipo de severidade da notificação
 */
export type NotificationSeverity = 'success' | 'info' | 'warn' | 'error';

/**
 * Interface para uma notificação individual
 */
export interface Notification {
  id: number;
  severity: NotificationSeverity;
  summary: string;
  detail: string;
  life?: number; // duração em milissegundos
}

/**
 * Serviço de notificações (toast messages)
 * Usa Signals do Angular 18 para estado reativo
 *
 * Uso:
 *   notificationService.success('Sucesso!', 'Operação realizada.');
 *   notificationService.error('Erro!', 'Falha ao processar requisição.');
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Signal que armazena a lista de notificações ativas
  private _notifications = signal<Notification[]>([]);

  // Expor como readonly para componentes
  readonly notifications = this._notifications.asReadonly();

  private contador = 0;

  constructor() {}

  /**
   * Adiciona uma notificação de sucesso
   */
  success(summary: string, detail: string, life: number = 5000): void {
    this.adicionarNotificacao('success', summary, detail, life);
  }

  /**
   * Adiciona uma notificação informativa
   */
  info(summary: string, detail: string, life: number = 5000): void {
    this.adicionarNotificacao('info', summary, detail, life);
  }

  /**
   * Adiciona uma notificação de aviso
   */
  warn(summary: string, detail: string, life: number = 7000): void {
    this.adicionarNotificacao('warn', summary, detail, life);
  }

  /**
   * Adiciona uma notificação de erro
   */
  error(summary: string, detail: string, life: number = 10000): void {
    this.adicionarNotificacao('error', summary, detail, life);
  }

  /**
   * Remove uma notificação específica pelo ID
   */
  remover(id: number): void {
    this._notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  }

  /**
   * Limpa todas as notificações
   */
  limparTodas(): void {
    this._notifications.set([]);
  }

  /**
   * Método interno para adicionar notificação à lista
   * Remove automaticamente após o tempo de vida
   */
  private adicionarNotificacao(
    severity: NotificationSeverity,
    summary: string,
    detail: string,
    life: number,
  ): void {
    this.contador++;
    const notification: Notification = {
      id: this.contador,
      severity,
      summary,
      detail,
      life,
    };

    // Adiciona à lista
    this._notifications.update((notifications) => [...notifications, notification]);

    // Agenda remoção automática após o tempo de vida
    if (life > 0) {
      setTimeout(() => {
        this.remover(notification.id);
      }, life);
    }
  }

  /**
   * Exibe múltiplos erros de uma vez (ex: erros de validação do backend)
   * Recebe array de { codigo, mensagem } e exibe cada um como toast
   */
  exibirErros(erros: { codigo: string; mensagem: string }[]): void {
    if (erros.length === 1) {
      this.error(erros[0].codigo, erros[0].mensagem);
    } else {
      erros.forEach((erro) => {
        this.error(erro.codigo, erro.mensagem, 8000);
      });
    }
  }

  /**
   * Exibe mensagem de sucesso para operações CRUD
   */
  sucessoOperacao(operacao: 'criado' | 'atualizado' | 'removido', entidade: string): void {
    const mensagens = {
      criado: `${entidade} criado(a) com sucesso!`,
      atualizado: `${entidade} atualizado(a) com sucesso!`,
      removido: `${entidade} removido(a) com sucesso!`,
    };

    this.success('Sucesso!', mensagens[operacao]);
  }
}
