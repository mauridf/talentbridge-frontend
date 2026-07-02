import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    PasswordModule,
    CardModule,
  ],
  template: `
    <div class="reset-password-page">
      <p-card styleClass="reset-password-card">
        <div class="reset-password-content">
          <div class="reset-password-icon">
            <i class="pi pi-lock"></i>
          </div>

          <h1>Redefinir Senha</h1>

          <p class="reset-password-description">Digite sua nova senha abaixo.</p>

          <div *ngIf="senhaRedefinida" class="success-message">
            <i class="pi pi-check-circle"></i>
            <p>Senha redefinida com sucesso!</p>
            <a routerLink="/login" class="login-link"> Ir para o login </a>
          </div>

          <form *ngIf="!senhaRedefinida" [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-field">
              <label for="novaSenha">Nova Senha</label>
              <p-password
                id="novaSenha"
                formControlName="novaSenha"
                [toggleMask]="true"
                placeholder="Nova senha"
                styleClass="w-full"
                inputStyleClass="w-full"
              >
              </p-password>
            </div>

            <div class="form-field">
              <label for="confirmacaoSenha">Confirmar Senha</label>
              <p-password
                id="confirmacaoSenha"
                formControlName="confirmacaoSenha"
                [toggleMask]="true"
                [feedback]="false"
                placeholder="Confirme a senha"
                styleClass="w-full"
                inputStyleClass="w-full"
              >
              </p-password>
              <small
                *ngIf="form.hasError('mismatch') && form.get('confirmacaoSenha')?.touched"
                class="form-error"
              >
                As senhas não conferem.
              </small>
            </div>

            <p-button
              type="submit"
              label="Redefinir Senha"
              icon="pi pi-check"
              [loading]="carregando"
              [disabled]="!token"
              styleClass="w-full"
            >
            </p-button>
          </form>

          <div *ngIf="!token" class="error-message">
            <i class="pi pi-exclamation-triangle"></i>
            <p>Token de recuperação inválido ou expirado. Solicite um novo link.</p>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `
      .reset-password-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: var(--surface-ground);
      }

      .reset-password-card {
        width: 100%;
        max-width: 450px;
      }

      .reset-password-content {
        text-align: center;
        padding: 1rem;
      }

      .reset-password-icon {
        font-size: 3rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
      }

      h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .reset-password-description {
        color: var(--text-color-secondary);
        margin-bottom: 1.5rem;
      }

      form {
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

      .success-message {
        margin-bottom: 1.5rem;

        i {
          font-size: 2rem;
          color: var(--success-color);
          margin-bottom: 0.5rem;
        }

        p {
          color: var(--success-color);
          margin: 0 0 1rem 0;
        }
      }

      .login-link {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: var(--primary-color);
        color: white;
        border-radius: var(--border-radius);
        text-decoration: none;
        font-size: 0.875rem;
      }

      .error-message {
        color: var(--danger-color);

        i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
      }
    `,
  ],
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  carregando = false;
  senhaRedefinida = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Captura token da URL
    this.token = this.route.snapshot.queryParams['token'];

    this.form = this.fb.group(
      {
        novaSenha: ['', [Validators.required, Validators.minLength(6)]],
        confirmacaoSenha: ['', Validators.required],
      },
      { validators: this.senhasConferem },
    );
  }

  private senhasConferem(group: FormGroup): { mismatch: boolean } | null {
    const senha = group.get('novaSenha')?.value;
    const confirmacao = group.get('confirmacaoSenha')?.value;
    return senha === confirmacao ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token) return;

    this.carregando = true;

    this.authService
      .redefinirSenha(this.token, this.form.value.novaSenha, this.form.value.confirmacaoSenha)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: () => {
          this.senhaRedefinida = true;
          this.notificationService.success('Sucesso!', 'Senha redefinida com sucesso.');
        },
        error: (error) => {
          this.notificationService.error('Erro', error.message || 'Erro ao redefinir senha.');
        },
      });
  }
}
