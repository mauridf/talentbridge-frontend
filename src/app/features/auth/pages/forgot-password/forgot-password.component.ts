import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    CardModule,
  ],
  template: `
    <div class="forgot-password-page">
      <p-card styleClass="forgot-password-card">
        <div class="forgot-password-content">
          <!-- Ícone -->
          <div class="forgot-password-icon">
            <i class="pi pi-envelope"></i>
          </div>

          <h1>Esqueceu a senha?</h1>

          <p class="forgot-password-description">
            Digite seu email abaixo e enviaremos um link para redefinir sua senha.
          </p>

          <!-- Sucesso -->
          <div *ngIf="emailEnviado" class="success-message">
            <i class="pi pi-check-circle"></i>
            <p>Email enviado com sucesso! Verifique sua caixa de entrada e siga as instruções.</p>
          </div>

          <!-- Formulário -->
          <form
            *ngIf="!emailEnviado"
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            class="forgot-password-form"
          >
            <div class="form-field">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                pInputText
                formControlName="email"
                placeholder="seu@email.com"
                class="w-full"
              />
              <small
                *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
                class="form-error"
              >
                Email válido é obrigatório.
              </small>
            </div>

            <p-button
              type="submit"
              label="Enviar Link"
              icon="pi pi-send"
              [loading]="carregando"
              styleClass="w-full"
            >
            </p-button>
          </form>

          <!-- Link voltar -->
          <div class="forgot-password-footer">
            <a routerLink="/login">
              <i class="pi pi-arrow-left"></i>
              Voltar para o login
            </a>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      .forgot-password-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: var(--surface-ground);
      }

      .forgot-password-card {
        width: 100%;
        max-width: 450px;
      }

      .forgot-password-content {
        text-align: center;
        padding: 1rem;
      }

      .forgot-password-icon {
        font-size: 3rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
      }

      h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .forgot-password-description {
        color: var(--text-color-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }

      .success-message {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid var(--success-color);
        border-radius: var(--border-radius);
        padding: 1rem;
        margin-bottom: 1.5rem;
        text-align: center;

        i {
          font-size: 2rem;
          color: var(--success-color);
          margin-bottom: 0.5rem;
        }

        p {
          color: var(--success-color);
          font-size: 0.875rem;
          margin: 0;
        }
      }

      .forgot-password-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-field {
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      label {
        font-size: 0.875rem;
        font-weight: 500;
      }

      .form-error {
        color: var(--danger-color);
        font-size: 0.75rem;
      }

      .forgot-password-footer {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--surface-border);

        a {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    `,
  ],
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  carregando = false;
  emailEnviado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.get('email')?.markAsTouched();
      return;
    }

    this.carregando = true;

    this.authService
      .solicitarRecuperacaoSenha(this.form.value.email)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: () => {
          this.emailEnviado = true;
          this.notificationService.success('Email Enviado!', 'Verifique sua caixa de entrada.');
        },
        error: (error) => {
          this.notificationService.error(
            'Erro',
            error.message || 'Erro ao enviar email. Tente novamente.',
          );
        },
      });
  }
}
