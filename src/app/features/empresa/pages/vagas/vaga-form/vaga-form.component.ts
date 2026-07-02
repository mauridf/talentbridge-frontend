import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { VagaService, VagaUpsertRequest } from '../../../services/vaga.service';
import { DominioService } from '../../../../../core/services/dominio.service';
import { DominioDto, DominioTipo } from '../../../../../core/models/dominio.models';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Subject, takeUntil, finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-vaga-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    InputSwitchModule,
    CardModule,
    StepsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './vaga-form.component.html',
  styleUrls: ['./vaga-form.component.scss'],
})
export class VagaFormComponent implements OnInit, OnDestroy {
  // Steps
  steps: MenuItem[] = [
    { label: 'Dados Básicos' },
    { label: 'Descrição e Requisitos' },
    { label: 'Revisão' },
  ];
  stepAtual = 0;

  // Form
  form!: FormGroup;
  carregando = false;
  enviando = false;
  editando = false;
  vagaId: string | null = null;

  // Domínios (dropdowns)
  regimesTrabalho: DominioDto[] = [];
  tiposContratacao: DominioDto[] = [];
  jornadasTrabalho: DominioDto[] = [];
  formacoesAcademicas: DominioDto[] = [];
  areasAtuacao: DominioDto[] = [];
  temposExperiencia: DominioDto[] = [];
  carregandoDominios = true;

  // Data mínima para calendário
  dataMinima = new Date();

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private vagaService: VagaService,
    private dominioService: DominioService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Verifica se está editando (tem ID na URL)
    this.vagaId = this.route.snapshot.paramMap.get('id');
    this.editando = !!this.vagaId;

    if (this.editando) {
      this.steps.unshift({ label: 'Vaga Existente' });
    }

    this.inicializarFormulario();
    this.carregarDominios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group({
      // Step 1: Dados Básicos
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      cargo: ['', Validators.required],
      regimeTrabalho: [null, Validators.required],
      tipoContratacao: [null, Validators.required],
      jornadaTrabalho: [null, Validators.required],
      salario: [null],
      quantidadeVagas: [1, [Validators.required, Validators.min(1)]],
      estado: ['SP', Validators.required],
      cidade: ['', Validators.required],
      dataCandidaturaInicio: [new Date(), Validators.required],
      dataCandidaturaFim: [null, Validators.required],

      // Step 2: Descrição e Requisitos
      descricao: ['', [Validators.required, Validators.minLength(50)]],
      atividades: [''],
      beneficios: [''],
      diferenciaisConsiderados: [''],
      formacaoAcademica: [null],
      formacaoAcademicaEliminatorio: [false],
      areaAtuacao: [null],
      tempoExperiencia: [null],
      tempoExperienciaEliminatorio: [false],
    });
  }

  private carregarDominios(): void {
    forkJoin({
      regimesTrabalho: this.dominioService.buscarPorTipo(DominioTipo.RegimeTrabalho),
      tiposContratacao: this.dominioService.buscarPorTipo(DominioTipo.TipoContratacao),
      jornadasTrabalho: this.dominioService.buscarPorTipo(DominioTipo.JornadaTrabalho),
      formacoesAcademicas: this.dominioService.buscarPorTipo(DominioTipo.FormacaoAcademica),
      areasAtuacao: this.dominioService.buscarPorTipo(DominioTipo.AreaAtuacao),
      temposExperiencia: this.dominioService.buscarPorTipo(DominioTipo.TempoExperiencia),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.regimesTrabalho = result.regimesTrabalho;
          this.tiposContratacao = result.tiposContratacao;
          this.jornadasTrabalho = result.jornadasTrabalho;
          this.formacoesAcademicas = result.formacoesAcademicas;
          this.areasAtuacao = result.areasAtuacao;
          this.temposExperiencia = result.temposExperiencia;
          this.carregandoDominios = false;
        },
        error: () => {
          this.carregandoDominios = false;
          this.notificationService.error('Erro', 'Falha ao carregar listas de seleção.');
        },
      });
  }

  /**
   * Verifica se o step atual é válido
   */
  isStepValido(step: number): boolean {
    switch (step) {
      case 0: // Dados Básicos
        return !!(
          this.form.get('titulo')?.valid &&
          this.form.get('cargo')?.valid &&
          this.form.get('regimeTrabalho')?.valid &&
          this.form.get('tipoContratacao')?.valid &&
          this.form.get('jornadaTrabalho')?.valid &&
          this.form.get('quantidadeVagas')?.valid &&
          this.form.get('cidade')?.valid &&
          this.form.get('dataCandidaturaFim')?.valid
        );
      case 1: // Descrição e Requisitos
        return this.form.get('descricao')?.valid || false;
      default:
        return true;
    }
  }

  /**
   * Avança para o próximo step
   */
  proximoStep(): void {
    if (this.isStepValido(this.stepAtual) && this.stepAtual < 2) {
      this.stepAtual++;
    }
  }

  /**
   * Volta para o step anterior
   */
  stepAnterior(): void {
    if (this.stepAtual > 0) {
      this.stepAtual--;
    }
  }

  /**
   * Salva a vaga (cria ou atualiza)
   */
  salvarVaga(): void {
    if (this.form.invalid) {
      this.notificationService.warn('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    // Valida período de candidatura
    const dataFim = this.form.value.dataCandidaturaFim;
    if (dataFim) {
      const diffDias = Math.ceil(
        (new Date(dataFim).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      if (diffDias < 15) {
        // Idealmente, mostrar confirmação aqui
        const confirmar = confirm(
          `O período de candidatura é de apenas ${diffDias} dias. Deseja continuar?`,
        );
        if (!confirmar) return;
      }
    }

    this.enviando = true;

    const request: VagaUpsertRequest = {
      id: this.vagaId,
      titulo: this.form.value.titulo,
      cargo: this.form.value.cargo,
      descricao: this.form.value.descricao,
      atividades: this.form.value.atividades || '',
      beneficios: this.form.value.beneficios || '',
      diferenciaisConsiderados: this.form.value.diferenciaisConsiderados || '',
      salario: this.form.value.salario || 0,
      regimeTrabalho: this.form.value.regimeTrabalho,
      jornadaTrabalho: this.form.value.jornadaTrabalho,
      tipoContratacao: this.form.value.tipoContratacao,
      formacaoAcademica: this.form.value.formacaoAcademica || 0,
      formacaoAcademicaEliminatorio: this.form.value.formacaoAcademicaEliminatorio || false,
      areaAtuacao: this.form.value.areaAtuacao || 0,
      tempoExperiencia: this.form.value.tempoExperiencia || 0,
      tempoExperienciaEliminatorio: this.form.value.tempoExperienciaEliminatorio || false,
      estado: this.form.value.estado,
      cidade: this.form.value.cidade,
      dataCandidaturaInicio: this.formatarDataISO(this.form.value.dataCandidaturaInicio),
      dataCandidaturaFim: this.formatarDataISO(this.form.value.dataCandidaturaFim),
      tipoVaga: 1, // Interna por padrão
      quantidadeVagas: this.form.value.quantidadeVagas,
      competencias: [],
    };

    this.vagaService
      .upsert(request)
      .pipe(finalize(() => (this.enviando = false)))
      .subscribe({
        next: (response) => {
          this.notificationService.success(
            'Sucesso!',
            `Vaga ${this.editando ? 'atualizada' : 'criada'} com sucesso!`,
          );
          this.router.navigate(['/empresa/oportunidades']);
        },
        error: (error) => {
          this.notificationService.error('Erro', error.message || 'Erro ao salvar vaga.');
        },
      });
  }

  private formatarDataISO(data: Date | string): string {
    if (!data) return '';
    const d = new Date(data);
    return d.toISOString();
  }

  /**
   * Obtém nome do domínio pelo código
   */
  getDominioNome(lista: DominioDto[], codigo: number): string {
    return lista.find((d) => d.codigo === codigo)?.nome || '-';
  }
}
