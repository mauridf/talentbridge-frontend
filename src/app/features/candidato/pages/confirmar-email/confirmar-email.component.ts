import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CandidatoService } from '../../services/candidato.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-confirmar-email',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule],
  template: `
    <div class="confirmar-email-page">
      <p-card styleClass="confirmar-email-card">
        <div class="confirmar-email-content">
          <!-- Carregando -->
          <div *ngIf="carregando" class="confirmar-status">
            <i
              class="pi pi-spin pi-spinner"
              style="font-size: 3rem; color: var(--primary-color)"
            ></i>
            <h2>Confirmando seu email...</h2>
            <p>Aguarde um momento.</p>
          </div>

          <!-- Sucesso -->
          <div *ngIf="confirmado" class="confirmar-status success">
            <i class="pi pi-check-circle"></i>
            <h2>Email Confirmado!</h2>
            <p>
              Sua conta foi ativada com sucesso. Agora você pode fazer login e acessar o sistema.
            </p>
            <div class="confirmar-actions">
              <p-button label="Ir para o Login" icon="pi pi-sign-in" routerLink="/login">
              </p-button>
            </div>
          </div>

          <!-- Erro -->
          <div *ngIf="erro" class="confirmar-status error">
            <i class="pi pi-exclamation-triangle"></i>
            <h2>Erro na Confirmação</h2>
            <p>{{ mensagemErro }}</p>
            <div class="confirmar-actions">
              <p-button
                label="Tentar Novamente"
                icon="pi pi-refresh"
                styleClass="p-button-outlined"
                (onClick)="confirmar()"
              >
              </p-button>
            </div>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      .confirmar-email-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: var(--surface-ground);
      }

      .confirmar-email-card {
        width: 100%;
        max-width: 450px;
      }

      .confirmar-email-content {
        text-align: center;
        padding: 1rem;
      }

      .confirmar-status {
        padding: 1rem 0;

        i {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        h2 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        p {
          color: var(--text-color-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        &.success i {
          color: var(--success-color);
        }

        &.error i {
          color: var(--danger-color);
        }
      }

      .confirmar-actions {
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class ConfirmarEmailComponent implements OnInit {
  carregando = true;
  confirmado = false;
  erro = false;
  mensagemErro = '';

  private email = '';
  private token = '';

  constructor(
    private route: ActivatedRoute,
    private candidatoService: CandidatoService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    // Captura parâmetros da URL
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.email || !this.token) {
      this.erro = true;
      this.carregando = false;
      this.mensagemErro = 'Link de confirmação inválido. Verifique se o link está completo.';
      return;
    }

    this.confirmar();
  }

  confirmar(): void {
    this.carregando = true;
    this.erro = false;

    this.candidatoService.confirmarEmail(this.email, this.token).subscribe({
      next: () => {
        this.carregando = false;
        this.confirmado = true;
        this.notificationService.success('Sucesso!', 'Email confirmado com sucesso.');
      },
      error: (error) => {
        this.carregando = false;
        this.erro = true;
        this.mensagemErro = error.message || 'Erro ao confirmar email. O link pode ter expirado.';
      },
    });
  }
}
