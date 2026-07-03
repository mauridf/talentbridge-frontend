import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TokenService } from '../../../../core/services/token.service';
import { PerfilSelectorModalComponent } from '../../../../shared/components/perfil-selector-modal/perfil-selector-modal.component';
import {
  LoginRequestDto,
  LoginMultiPerfilResponseDto,
  PerfilDisponivelDto,
} from '@core/models/auth.models';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    CardModule,
    PerfilSelectorModalComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  carregando = false;
  mostrarModalPerfil = false;
  perfisDisponiveis: PerfilDisponivelDto[] = [];
  tokenTemporario = '';
  lembrarEmail = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Se já estiver autenticado, redireciona
    if (this.tokenService.temToken() && !this.tokenService.isTokenExpirado()) {
      this.redirecionarPorPerfil();
      return;
    }

    this.inicializarFormulario();
    this.carregarEmailLembrado();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa o formulário reativo
   */
  private inicializarFormulario(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      lembrar: [false],
    });
  }

  /**
   * Carrega email salvo no localStorage (se existir)
   */
  private carregarEmailLembrado(): void {
    const emailSalvo = localStorage.getItem('lembrarEmail');
    if (emailSalvo) {
      this.loginForm.patchValue({
        email: emailSalvo,
        lembrar: true,
      });
    }
  }

  /**
   * Realiza o login
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Marca todos os campos como touched para mostrar erros
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
      this.notificationService.warn('Atenção', 'Preencha todos os campos corretamente.');
      return;
    }

    this.carregando = true;
    const credentials: LoginRequestDto = {
      email: this.loginForm.value.email,
      senha: this.loginForm.value.senha,
    };

    this.authService
      .login(credentials)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.carregando = false)),
      )
      .subscribe({
        next: (response) => {
          // Salva email se "lembrar" estiver marcado
          if (this.loginForm.value.lembrar) {
            localStorage.setItem('lembrarEmail', credentials.email);
          } else {
            localStorage.removeItem('lembrarEmail');
          }

          // Verifica se é multi-perfil
          if (this.authService.isMultiPerfil(response)) {
            this.tratarMultiPerfil(response);
            return;
          }

          // Login simples - redireciona
          this.notificationService.success('Bem-vindo!', 'Login realizado com sucesso.');
          this.redirecionarPorPerfil();
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.notificationService.error(
            'Erro de Autenticação',
            error.message || 'Email ou senha inválidos. Tente novamente.',
          );
        },
      });
  }

  /**
   * Trata resposta multi-perfil
   */
  private tratarMultiPerfil(response: LoginMultiPerfilResponseDto): void {
    if (response.multiPerfil) {
      this.perfisDisponiveis = response.perfisDisponiveis;
      this.tokenTemporario = response.tokenTemporario;
      this.mostrarModalPerfil = true;
      this.notificationService.info(
        'Múltiplos Perfis',
        'Selecione o perfil com o qual deseja acessar.',
      );
    } else if (response.multiEmpresa) {
      // Multi-empresa: redireciona para página de seleção
      // (implementaremos depois)
      this.notificationService.info(
        'Múltiplas Empresas',
        'Selecione a empresa que deseja acessar.',
      );
    }
  }

  /**
   * Confirma seleção de perfil no modal
   */
  onConfirmarPerfil(perfilCodigo: string): void {
    this.carregando = true;

    this.authService
      .selecionarPerfil(this.tokenTemporario, perfilCodigo)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.carregando = false;
          this.mostrarModalPerfil = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.notificationService.success(
            'Perfil selecionado!',
            `Acessando como ${response.perfil}.`,
          );
          this.redirecionarPorPerfil();
        },
        error: (error) => {
          this.notificationService.error('Erro', 'Falha ao selecionar perfil. Tente novamente.');
        },
      });
  }

  /**
   * Redireciona baseado no perfil do usuário
   */
  private redirecionarPorPerfil(): void {
    const claims = this.tokenService.obterClaims();

    if (!claims) {
      this.router.navigate(['/login']);
      return;
    }

    // Verifica se tem URL de retorno
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    // Redireciona baseado no perfil
    switch (claims.perfil) {
      case 'CANDIDATO':
        this.router.navigate(['/candidatos/dashboard']);
        break;
      case 'GESTOR_EMPRESA':
      case 'RECRUTADOR':
        this.router.navigate(['/empresa/dashboard']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
