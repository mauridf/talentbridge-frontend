import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChipsModule } from 'primeng/chips';
import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { finalize } from 'rxjs';
import {
  CandidatoService, PerfilProfissionalRequest, PerfilProfissionalResponse,
  FormacaoAcademicaDto, ExperienciaProfissionalDto, CompetenciaCandidatoDto,
} from '../../services/candidato.service';
import { DominioService } from '../../../../core/services/dominio.service';
import { DominioTipo, DominioDto } from '../../../../core/models/dominio.models';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-perfil-profissional',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, CardModule, InputTextModule,
    InputNumberModule, CalendarModule, DropdownModule, SelectButtonModule,
    ChipsModule, ChipModule, CheckboxModule, ConfirmDialogModule, PageHeaderComponent,
  ],
  providers: [ConfirmationService],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Perfil Profissional" subtitulo="Adicione suas experiências e formações"></app-page-header>

      @if (carregando) {
        <p-card><p class="text-center">Carregando...</p></p-card>
      } @else {
        <form (ngSubmit)="salvar()">
          <!-- Dispensa de Experiência -->
          <p-card header="Preferências" styleClass="mb-3">
            <div class="field-checkbox">
              <p-checkbox [(ngModel)]="form.dispensaExperienciaProfissional" name="dispensaExperiencia" binary="true" inputId="dispensa"></p-checkbox>
              <label for="dispensa" class="ml-2">Não possuo experiência profissional</label>
            </div>
          </p-card>

          <!-- Formações Acadêmicas -->
          <p-card header="Formação Acadêmica" styleClass="mb-3">
            @for (f of form.formacoesAcademicas; track $index) {
              <div class="grid p-fluid formacao-item">
                <div class="col-12 md:col-4">
                  <label class="block mb-1">Grau</label>
                  <input pInputText [(ngModel)]="f.grau" [name]="'grau_' + $index" placeholder="Ex: Superior, Técnico" />
                </div>
                <div class="col-12 md:col-4">
                  <label class="block mb-1">Área de Atuação</label>
                  <input pInputText [(ngModel)]="f.areaAtuacao" [name]="'area_' + $index" placeholder="Ex: TI, Saúde" />
                </div>
                <div class="col-12 md:col-2">
                  <label class="block mb-1">Data Conclusão</label>
                  <p-calendar [(ngModel)]="f.dataConclusao" [name]="'data_' + $index" view="month" dateFormat="mm/yy" [showClear]="true"></p-calendar>
                </div>
                <div class="col-12 md:col-1 flex align-items-end">
                  <div class="field-checkbox">
                    <p-checkbox [(ngModel)]="f.concluido" [name]="'concluido_' + $index" binary="true" [inputId]="'concluido_' + $index"></p-checkbox>
                    <label [for]="'concluido_' + $index" class="ml-1">Concluído</label>
                  </div>
                </div>
                <div class="col-12 md:col-1 flex align-items-end">
                  <p-button icon="pi pi-trash" severity="danger" text (onClick)="removerFormacao($index)"></p-button>
                </div>
              </div>
            }
            <p-button label="Adicionar Formação" icon="pi pi-plus" text (onClick)="adicionarFormacao()"></p-button>
          </p-card>

          <!-- Experiências Profissionais -->
          <p-card header="Experiências Profissionais" styleClass="mb-3">
            @for (e of form.experienciasProfissionais; track $index) {
              <div class="grid p-fluid experiencia-item">
                <div class="col-12 md:col-4">
                  <label class="block mb-1">Empresa</label>
                  <input pInputText [(ngModel)]="e.empresa" [name]="'emp_' + $index" />
                </div>
                <div class="col-12 md:col-4">
                  <label class="block mb-1">Cargo</label>
                  <input pInputText [(ngModel)]="e.posicao" [name]="'pos_' + $index" />
                </div>
                <div class="col-12 md:col-2">
                  <label class="block mb-1">Data Início</label>
                  <p-calendar [(ngModel)]="e.dataInicio" [name]="'dtIni_' + $index" view="month" dateFormat="mm/yy"></p-calendar>
                </div>
                <div class="col-12 md:col-2">
                  <label class="block mb-1">Data Fim</label>
                  <p-calendar [(ngModel)]="e.dataFim" [name]="'dtFim_' + $index" view="month" dateFormat="mm/yy" [showClear]="true"></p-calendar>
                </div>
                <div class="col-12 md:col-2 flex align-items-end">
                  <div class="field-checkbox">
                    <p-checkbox [(ngModel)]="e.empregoAtual" [name]="'atu_' + $index" binary="true" [inputId]="'atu_' + $index"></p-checkbox>
                    <label [for]="'atu_' + $index" class="ml-1">Atual</label>
                  </div>
                </div>
                <div class="col-12 md:col-1 flex align-items-end">
                  <p-button icon="pi pi-trash" severity="danger" text (onClick)="removerExperiencia($index)"></p-button>
                </div>
              </div>
            }
            <p-button label="Adicionar Experiência" icon="pi pi-plus" text (onClick)="adicionarExperiencia()"></p-button>
          </p-card>

          <!-- Áreas de Interesse -->
          <p-card header="Áreas de Interesse" styleClass="mb-3">
            <div class="grid p-fluid">
              <div class="col-12">
                <p-dropdown [options]="areasInteresseOptions" [(ngModel)]="areaInteresseSelecionada" name="areaInteresse"
                  optionLabel="nome" optionValue="codigo" placeholder="Selecione uma área de interesse"
                  (onChange)="adicionarAreaInteresse()">
                </p-dropdown>
              </div>
              <div class="col-12 flex gap-2 flex-wrap">
                @for (a of areasInteresseSelecionadas; track $index) {
                  <p-chip [label]="getAreaNome(a)" removable (onRemove)="removerAreaInteresse($index)"></p-chip>
                }
              </div>
            </div>
          </p-card>

          <div class="flex justify-content-end gap-2">
            <p-button label="Cancelar" severity="secondary" (onClick)="voltar()"></p-button>
            <p-button label="Salvar" type="submit" [loading]="salvando" icon="pi pi-check"></p-button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    label { font-weight: 600; font-size: 0.9rem; color: var(--text-color-secondary); }
    .mb-3 { margin-bottom: 1rem; }
    .formacao-item, .experiencia-item {
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--surface-border);
    }
    .formacao-item:last-child, .experiencia-item:last-child { border-bottom: none; }
  `]
})
export class PerfilProfissionalComponent implements OnInit {
  carregando = true;
  salvando = false;

  form: PerfilProfissionalRequest = {
    dispensaExperienciaProfissional: false,
    formacoesAcademicas: [],
    experienciasProfissionais: [],
    areasInteresse: [],
  };

  areasInteresseOptions: DominioDto[] = [];
  areasInteresseSelecionadas: number[] = [];
  areaInteresseSelecionada: number | null = null;

  constructor(
    private candidatoService: CandidatoService,
    private dominioService: DominioService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.dominioService.buscarPorTipo(DominioTipo.AreaInteresse).subscribe(d => this.areasInteresseOptions = d);
    this.carregarPerfil();
  }

  private carregarPerfil(): void {
    this.candidatoService.obterPerfilProfissional()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (p) => {
          this.form.dispensaExperienciaProfissional = p.dispensaExperienciaProfissional;
          this.form.formacoesAcademicas = p.formacoesAcademicas || [];
          this.form.experienciasProfissionais = p.experienciasProfissionais || [];
          this.areasInteresseSelecionadas = p.areasInteresse || [];
        },
        error: () => this.carregando = false,
      });
  }

  adicionarFormacao(): void {
    this.form.formacoesAcademicas!.push({ grau: '', areaAtuacao: '', dataConclusao: '', concluido: false });
  }

  removerFormacao(index: number): void {
    this.form.formacoesAcademicas?.splice(index, 1);
  }

  adicionarExperiencia(): void {
    this.form.experienciasProfissionais!.push({ empresa: '', posicao: '', dataInicio: '', dataFim: null, empregoAtual: false });
  }

  removerExperiencia(index: number): void {
    this.form.experienciasProfissionais?.splice(index, 1);
  }

  adicionarAreaInteresse(): void {
    if (this.areaInteresseSelecionada && !this.areasInteresseSelecionadas.includes(this.areaInteresseSelecionada)) {
      this.areasInteresseSelecionadas.push(this.areaInteresseSelecionada);
    }
    this.areaInteresseSelecionada = null;
  }

  removerAreaInteresse(index: number): void {
    this.areasInteresseSelecionadas.splice(index, 1);
  }

  getAreaNome(codigo: number): string {
    return this.areasInteresseOptions.find(a => a.codigo === codigo)?.nome || '';
  }

  salvar(): void {
    this.form.areasInteresse = this.areasInteresseSelecionadas;
    this.salvando = true;
    this.candidatoService.salvarPerfilProfissional(this.form)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Sucesso', 'Perfil profissional salvo com sucesso!');
          this.router.navigate(['/candidatos/dashboard']);
        },
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }

  voltar(): void {
    this.router.navigate(['/candidatos/dashboard']);
  }
}
