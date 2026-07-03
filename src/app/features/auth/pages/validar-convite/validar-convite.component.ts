import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ConviteService } from '../../../../core/services/convite.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-validar-convite',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, CardModule, RouterLink,
  ],
  template: `
    <div class="validar-convite-page">
      <div class="validar-convite-container">
        <p-card styleClass="validar-convite-card">
          <div class="validar-convite-header">
            <i class="pi pi-envelope" style="font-size: 2.5rem; color: var(--primary-color)"></i>
            <h1>Validar Convite</h1>
            <p>Insira o token recebido por email para criar sua conta</p>
          </div>

          @if (!validando && !conviteValido) {
            <div class="validar-convite-form">
              <div class="form-field">
                <label for="token">Token do Convite</label>
                <input
                  id="token"
                  type="text"
                  pInputText
                  [(ngModel)]="token"
                  placeholder="Cole o token recebido no email"
                  class="w-full"
                />
              </div>
              <p-button
                label="Validar Token"
                icon="pi pi-check"
                [loading]="carregando"
                [disabled]="!token.trim()"
                (onClick)="validar()"
                styleClass="w-full"
              ></p-button>
            </div>
          }

          @if (validando) {
            <div class="validar-convite-status">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--primary-color)"></i>
              <p>Validando convite...</p>
            </div>
          }

          @if (conviteInvalido) {
            <div class="validar-convite-status error">
              <i class="pi pi-exclamation-triangle" style="font-size: 2.5rem; color: var(--danger-color)"></i>
              <h2>Convite Inválido</h2>
              <p>O token informado é inválido ou expirou. Solicite um novo convite.</p>
              <p-button label="Tentar Novamente" icon="pi pi-refresh" (onClick)="reiniciar()"></p-button>
            </div>
          }

          @if (conviteValido && !validando) {
            <div class="validar-convite-status success">
              <i class="pi pi-check-circle" style="font-size: 2.5rem; color: var(--success-color)"></i>
              <h2>Convite Válido!</h2>
              <p>Redirecionando para o cadastro...</p>
            </div>
          }

          <div class="validar-convite-footer">
            <a routerLink="/login">
              <i class="pi pi-arrow-left"></i>
              Voltar para o Login
            </a>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .validar-convite-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-ground);
      padding: 1rem;
    }
    .validar-convite-container {
      width: 100%;
      max-width: 480px;
    }
    .validar-convite-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .validar-convite-header h1 {
      font-size: 1.5rem;
      margin: 0.75rem 0 0.25rem;
    }
    .validar-convite-header p {
      color: var(--text-color-secondary);
      font-size: 0.875rem;
      margin: 0;
    }
    .validar-convite-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .form-field label {
      font-size: 0.875rem;
      font-weight: 500;
    }
    .validar-convite-status {
      text-align: center;
      padding: 2rem 0;
    }
    .validar-convite-status h2 {
      margin: 0.75rem 0 0.5rem;
    }
    .validar-convite-status p {
      color: var(--text-color-secondary);
      margin-bottom: 1.25rem;
    }
    .validar-convite-status.error h2,
    .validar-convite-status.success h2 {
      margin: 0.75rem 0 0.5rem;
    }
    .validar-convite-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border);
    }
    .validar-convite-footer a {
      color: var(--primary-color);
      text-decoration: none;
      font-size: 0.875rem;
    }
    .validar-convite-footer a:hover {
      text-decoration: underline;
    }
  `],
})
export class ValidarConviteComponent implements OnInit {
  token = '';
  carregando = false;
  validando = false;
  conviteInvalido = false;
  conviteValido = false;

  private conviteService = inject(ConviteService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const tokenUrl = this.route.snapshot.queryParams['token'];
    if (tokenUrl) {
      this.token = tokenUrl;
      this.validar();
    }
  }

  validar(): void {
    if (!this.token.trim()) return;

    this.carregando = true;
    this.validando = true;
    this.conviteInvalido = false;

    this.conviteService.validar(this.token.trim())
      .pipe(finalize(() => {
        this.carregando = false;
        this.validando = false;
      }))
      .subscribe({
        next: (convite) => {
          this.conviteValido = true;

          if (convite.tipo === 'EMPRESA' || convite.tipo === 'Empresa') {
            this.notificationService.success('Convite Válido!', 'Redirecionando para cadastro da empresa.');
            setTimeout(() => this.router.navigate(['/empresa/registro'], {
              queryParams: { token: this.token.trim() }
            }), 1000);
          } else if (convite.tipo === 'RECRUTADOR' || convite.tipo === 'Recrutador') {
            this.notificationService.success('Convite Válido!', 'Redirecionando para cadastro do recrutador.');
            setTimeout(() => this.router.navigate(['/recrutador/registro'], {
              queryParams: { token: this.token.trim() }
            }), 1000);
          } else {
            this.notificationService.error('Tipo desconhecido', 'Tipo de convite não reconhecido.');
            this.conviteValido = false;
          }
        },
        error: () => {
          this.conviteInvalido = true;
        },
      });
  }

  reiniciar(): void {
    this.token = '';
    this.conviteInvalido = false;
    this.conviteValido = false;
    this.carregando = false;
  }
}
