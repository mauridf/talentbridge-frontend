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
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { EmpresaService } from '../../services/empresa.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registro-empresa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    InputMaskModule,
    CardModule,
    DividerModule,
  ],
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.scss'],
})
export class RegistroEmpresaComponent implements OnInit {
  form!: FormGroup;
  carregando = false;
  validandoConvite = true;
  conviteInvalido = false;
  cadastroRealizado = false;
  mensagemSucesso = '';
  tokenConvite = '';

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Captura token do convite da URL
    this.tokenConvite = this.route.snapshot.queryParams['token'] || '';

    if (!this.tokenConvite) {
      this.conviteInvalido = true;
      this.validandoConvite = false;
      return;
    }

    this.validarTokenConvite();
    this.inicializarFormulario();
  }

  private validarTokenConvite(): void {
    this.empresaService.validarConvite(this.tokenConvite).subscribe({
      next: () => {
        this.validandoConvite = false;
      },
      error: () => {
        this.validandoConvite = false;
        this.conviteInvalido = true;
      },
    });
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group(
      {
        // Dados do Gestor
        nomeGestor: ['', [Validators.required, Validators.minLength(3)]],
        emailGestor: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmacaoSenha: ['', Validators.required],

        // Dados da Empresa
        nomeEmpresa: ['', [Validators.required, Validators.minLength(2)]],
        cnpj: ['', [Validators.required, Validators.minLength(14)]],
        telefoneEmpresa: ['', Validators.required],
        segmentoId: ['', Validators.required],
      },
      { validators: this.senhasConferem },
    );
  }

  private senhasConferem(group: FormGroup): { mismatch: boolean } | null {
    const senha = group.get('senha')?.value;
    const confirmacao = group.get('confirmacaoSenha')?.value;
    if (!senha || !confirmacao) return null;
    return senha === confirmacao ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });

      if (this.form.hasError('mismatch')) {
        this.notificationService.warn('Atenção', 'As senhas não conferem.');
        return;
      }

      this.notificationService.warn('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    this.carregando = true;

    const request = {
      tokenConvite: this.tokenConvite,
      ...this.form.value,
      cnpj: this.form.value.cnpj.replace(/\D/g, ''), // Remove máscara
      telefoneEmpresa: this.form.value.telefoneEmpresa.replace(/\D/g, ''),
    };

    this.empresaService
      .criarEmpresa(request)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (response) => {
          this.cadastroRealizado = true;
          this.mensagemSucesso = response.mensagem;
          this.notificationService.success(
            'Empresa Cadastrada!',
            'Sua empresa foi registrada com sucesso.',
          );
        },
        error: (error) => {
          this.notificationService.error(
            'Erro no Cadastro',
            error.message || 'Erro ao cadastrar empresa.',
          );
        },
      });
  }
}
