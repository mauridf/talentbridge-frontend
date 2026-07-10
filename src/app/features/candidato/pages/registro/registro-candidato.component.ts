import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { CandidatoService, CriarCandidatoRequest } from '../../services/candidato.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registro-candidato',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    InputMaskModule,
  ],
  templateUrl: './registro-candidato.component.html',
  styleUrls: ['./registro-candidato.component.scss'],
})
export class RegistroCandidatoComponent {
  form!: FormGroup;
  carregando = false;
  cadastroRealizado = false;
  emailCadastrado = '';
  showSenha = false;
  showConfirmSenha = false;

  // Configuração de data: mínimo 14 anos, máximo 100 anos
  dataMaxima = new Date();
  dataMinima = new Date();

  constructor(
    private fb: FormBuilder,
    private candidatoService: CandidatoService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    // Data mínima: 100 anos atrás
    this.dataMinima.setFullYear(this.dataMinima.getFullYear() - 100);
    // Data máxima: 14 anos atrás (idade mínima para trabalhar)
    this.dataMaxima.setFullYear(this.dataMaxima.getFullYear() - 14);

    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmacaoSenha: ['', Validators.required],
        dataNascimento: [null, Validators.required],
        telefone: ['', Validators.required],
        nomeSocial: [''],
        codigoParceiro: [''],
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

      this.notificationService.warn(
        'Atenção',
        'Preencha todos os campos obrigatórios corretamente.',
      );
      return;
    }

    this.carregando = true;

    const request: CriarCandidatoRequest = {
      ...this.form.value,
      dataNascimento: this.formatarData(this.form.value.dataNascimento),
    };

    this.candidatoService
      .criar(request)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (response) => {
          this.cadastroRealizado = true;
          this.emailCadastrado = response.email;
          this.notificationService.success(
            'Cadastro Realizado!',
            'Verifique seu email para confirmar a conta.',
          );
        },
        error: (error) => {
          this.notificationService.error(
            'Erro no Cadastro',
            error.message || 'Ocorreu um erro ao criar sua conta.',
          );
        },
      });
  }

  private formatarData(data: Date): string {
    if (!data) return '';
    return data.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
  }
}
