import { Component, OnInit, inject } from '@angular/core';
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
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RecrutadorService } from '../../../../core/services/recrutador.service';
import { ConviteService } from '../../../../core/services/convite.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registro-recrutador',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
    ButtonModule, InputTextModule, PasswordModule, CardModule, DividerModule,
  ],
  template: `
    <div class="registro-page">
      <div class="registro-container">
        <p-card styleClass="registro-card">
          <div class="registro-header">
            <h1>Cadastro de Recrutador</h1>
            <p>Você foi convidado para fazer parte de uma equipe! Preencha seus dados.</p>
          </div>

          <p-divider></p-divider>

          @if (validandoConvite) {
            <div class="registro-status">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--primary-color)"></i>
              <p>Validando convite...</p>
            </div>
          }

          @if (conviteInvalido && !validandoConvite) {
            <div class="registro-status error">
              <i class="pi pi-exclamation-triangle"></i>
              <h2>Convite Inválido</h2>
              <p>O link de convite é inválido ou expirou. Solicite um novo convite ao gestor da empresa.</p>
              <p-button label="Voltar ao Login" icon="pi pi-arrow-left" routerLink="/login"></p-button>
            </div>
          }

          @if (cadastroRealizado) {
            <div class="registro-status success">
              <i class="pi pi-check-circle"></i>
              <h2>Cadastro Realizado!</h2>
              <p>{{ mensagemSucesso }}</p>
              <p-button label="Ir para o Login" icon="pi pi-sign-in" routerLink="/login"></p-button>
            </div>
          }

          @if (!validandoConvite && !conviteInvalido && !cadastroRealizado) {
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="registro-form">
              <div class="form-section">
                <h3><i class="pi pi-user"></i> Seus Dados</h3>

                <div class="form-grid">
                  <div class="form-field full-width">
                    <label for="nome">Nome Completo *</label>
                    <input id="nome" type="text" pInputText formControlName="nome" placeholder="Seu nome completo" />
                    @if (form.get('nome')?.invalid && form.get('nome')?.touched) {
                      <small class="form-error">Nome é obrigatório.</small>
                    }
                  </div>

                  <div class="form-field">
                    <label for="email">Email *</label>
                    <input id="email" type="email" pInputText formControlName="email" placeholder="seu@email.com" readonly />
                    @if (emailConvite) {
                      <small class="form-hint">Email definido no convite</small>
                    }
                  </div>

                  <div class="form-field">
                    <label for="senha">Senha *</label>
                    <p-password
                      id="senha"
                      formControlName="senha"
                      [toggleMask]="true"
                      placeholder="Mínimo 6 caracteres"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                    ></p-password>
                  </div>

                  <div class="form-field">
                    <label for="confirmacaoSenha">Confirmar Senha *</label>
                    <p-password
                      id="confirmacaoSenha"
                      formControlName="confirmacaoSenha"
                      [toggleMask]="true"
                      [feedback]="false"
                      placeholder="Repita a senha"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                    ></p-password>
                    @if (form.hasError('mismatch') && form.get('confirmacaoSenha')?.touched) {
                      <small class="form-error">As senhas não conferem.</small>
                    }
                  </div>
                </div>
              </div>

              @if (empresaNome) {
                <div class="form-section info">
                  <i class="pi pi-building"></i>
                  <span>Você será vinculado à empresa: <strong>{{ empresaNome }}</strong></span>
                </div>
              }

              <div class="form-actions">
                <p-button type="submit" label="Criar Conta" icon="pi pi-user-plus" [loading]="carregando" styleClass="w-full"></p-button>
              </div>

              <div class="form-footer">
                <p>Já tem uma conta?</p>
                <a routerLink="/login">
                  <i class="pi pi-sign-in"></i> Fazer Login
                </a>
              </div>
            </form>
          }
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .registro-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-ground);
      padding: 1rem;
    }
    .registro-container {
      width: 100%;
      max-width: 600px;
    }
    .registro-header {
      text-align: center;
    }
    .registro-header h1 {
      font-size: 1.5rem;
      margin: 0 0 0.25rem;
    }
    .registro-header p {
      color: var(--text-color-secondary);
      font-size: 0.875rem;
      margin: 0;
    }
    .registro-status {
      text-align: center;
      padding: 2rem 0;
    }
    .registro-status h2 {
      margin: 0.75rem 0 0.5rem;
    }
    .registro-status p {
      color: var(--text-color-secondary);
      margin-bottom: 1.25rem;
    }
    .registro-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-section h3 {
      font-size: 1rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .form-section.info {
      padding: 0.75rem;
      background: var(--surface-highlight);
      border-radius: var(--border-radius);
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .form-field.full-width {
      grid-column: 1 / -1;
    }
    .form-field label {
      font-size: 0.875rem;
      font-weight: 500;
    }
    .form-error {
      color: var(--danger-color);
      font-size: 0.75rem;
    }
    .form-hint {
      color: var(--text-color-secondary);
      font-size: 0.75rem;
    }
    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .form-footer {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border);
    }
    .form-footer p {
      color: var(--text-color-secondary);
      font-size: 0.875rem;
      margin: 0 0 0.5rem;
    }
    .form-footer a {
      color: var(--primary-color);
      text-decoration: none;
    }
    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class RegistroRecrutadorComponent implements OnInit {
  form!: FormGroup;
  carregando = false;
  validandoConvite = false;
  conviteInvalido = false;
  cadastroRealizado = false;
  mensagemSucesso = '';
  tokenConvite = '';
  emailConvite = '';
  empresaNome = '';

  private fb = inject(FormBuilder);
  private recrutadorService = inject(RecrutadorService);
  private conviteService = inject(ConviteService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.tokenConvite = this.route.snapshot.queryParams['token'] || '';

    if (!this.tokenConvite) {
      this.conviteInvalido = true;
      this.notificationService.error('Token ausente', 'Link de convite inválido.');
      return;
    }

    this.inicializarFormulario();
    this.validarToken();
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3)]],
        email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmacaoSenha: ['', Validators.required],
      },
      { validators: this.senhasConferem },
    );
  }

  private validarToken(): void {
    this.validandoConvite = true;
    this.conviteService.validar(this.tokenConvite).subscribe({
      next: (convite) => {
        this.emailConvite = convite.email;
        this.empresaNome = convite.nomeEmpresa || '';
        this.form.patchValue({ email: convite.email });
        this.validandoConvite = false;
      },
      error: () => {
        this.validandoConvite = false;
        this.conviteInvalido = true;
        this.notificationService.error('Convite Inválido', 'O convite é inválido ou expirou.');
      },
    });
  }

  private senhasConferem(group: FormGroup): { mismatch: boolean } | null {
    const senha = group.get('senha')?.value;
    const confirmacao = group.get('confirmacaoSenha')?.value;
    if (!senha || !confirmacao) return null;
    return senha === confirmacao ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => this.form.get(key)?.markAsTouched());
      if (this.form.hasError('mismatch')) {
        this.notificationService.warn('Atenção', 'As senhas não conferem.');
        return;
      }
      this.notificationService.warn('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    this.carregando = true;

    this.recrutadorService.criar({
      tokenConvite: this.tokenConvite,
      nome: this.form.value.nome,
      email: this.emailConvite,
      senha: this.form.value.senha,
      confirmacaoSenha: this.form.value.confirmacaoSenha,
    }).pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (response) => {
          this.cadastroRealizado = true;
          this.mensagemSucesso = response.mensagem;
          this.notificationService.success('Conta Criada!', 'Sua conta de recrutador foi criada com sucesso.');
        },
        error: (error) => {
          this.notificationService.error('Erro no Cadastro', error.message || 'Erro ao criar conta.');
        },
      });
  }
}
