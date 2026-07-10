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
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { EmpresaService, CriarEmpresaRequest } from '../../services/empresa.service';
import { SegmentoService, Segmento } from '../../../../core/services/segmento.service';
import { ConviteService } from '../../../../core/services/convite.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registro-empresa',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
    ButtonModule, InputTextModule, InputMaskModule,
    DropdownModule,
  ],
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.scss'],
})
export class RegistroEmpresaComponent implements OnInit {
  form!: FormGroup;
  carregando = false;
  validandoConvite = false;
  conviteInvalido = false;
  cadastroRealizado = false;
  mensagemSucesso = '';
  tokenConvite = '';
  ehAutoCadastro = false;
  segmentos: Segmento[] = [];
  showSenha = false;
  showConfirmSenha = false;

  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);
  private segmentoService = inject(SegmentoService);
  private conviteService = inject(ConviteService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.tokenConvite = this.route.snapshot.queryParams['token'] || '';
    this.ehAutoCadastro = !this.tokenConvite;

    this.carregarSegmentos();
    this.inicializarFormulario();

    if (this.tokenConvite) {
      this.validarTokenConvite();
    }
  }

  private carregarSegmentos(): void {
    this.segmentoService.listar().subscribe({
      next: (segmentos) => this.segmentos = segmentos,
      error: () => this.notificationService.error('Erro', 'Falha ao carregar segmentos.'),
    });
  }

  private validarTokenConvite(): void {
    this.validandoConvite = true;
    this.conviteService.validar(this.tokenConvite).subscribe({
      next: () => this.validandoConvite = false,
      error: () => {
        this.validandoConvite = false;
        this.conviteInvalido = true;
      },
    });
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group(
      {
        nomeGestor: ['', [Validators.required, Validators.minLength(3)]],
        emailGestor: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmacaoSenha: ['', Validators.required],

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
      Object.keys(this.form.controls).forEach((key) => this.form.get(key)?.markAsTouched());
      if (this.form.hasError('mismatch')) {
        this.notificationService.warn('Atenção', 'As senhas não conferem.');
        return;
      }
      this.notificationService.warn('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    this.carregando = true;

    const request: CriarEmpresaRequest = {
      ...this.form.value,
      cnpj: this.form.value.cnpj.replace(/\D/g, ''),
      telefoneEmpresa: this.form.value.telefoneEmpresa.replace(/\D/g, ''),
      tokenConvite: this.tokenConvite || undefined,
    };

    this.empresaService
      .criarEmpresa(request)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (response) => {
          this.cadastroRealizado = true;
          this.mensagemSucesso = response.mensagem;
          this.notificationService.success('Empresa Cadastrada!', 'Sua empresa foi registrada com sucesso.');
        },
        error: (error) => {
          this.notificationService.error('Erro no Cadastro', error.message || 'Erro ao cadastrar empresa.');
        },
      });
  }
}
