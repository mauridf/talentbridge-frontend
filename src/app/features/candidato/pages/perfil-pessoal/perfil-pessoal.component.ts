import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CandidatoService, PerfilPessoalRequest } from '../../services/candidato.service';
import { DominioService } from '../../../../core/services/dominio.service';
import { DominioTipo, DominioDto } from '../../../../core/models/dominio.models';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-perfil-pessoal',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, CardModule, InputTextModule,
    InputTextareaModule, InputMaskModule, DropdownModule, DividerModule,
    SelectButtonModule, PageHeaderComponent,
  ],
  template: `
    <div class="page-container fade-in">
      <app-page-header titulo="Perfil Pessoal" subtitulo="Complete suas informações pessoais"></app-page-header>

      @if (carregando) {
        <p-card><p class="text-center">Carregando...</p></p-card>
      } @else {
        <form (ngSubmit)="salvar()">
          <!-- Informações Básicas -->
          <p-card header="Informações Básicas" styleClass="mb-3">
            <div class="grid p-fluid">
              <div class="col-12 md:col-6">
                <label class="block mb-2">Sobre Mim</label>
                <textarea pInputTextarea [(ngModel)]="form.sobreMim" name="sobreMim" rows="4" style="resize: vertical"></textarea>
              </div>
              <div class="col-12 md:col-6">
                <label class="block mb-2">Local de Residência</label>
                <input pInputText [(ngModel)]="form.localResidencia" name="localResidencia" />
              </div>
              <div class="col-12 md:col-6">
                <label class="block mb-2">CPF</label>
                <input pInputText [(ngModel)]="form.cpf" name="cpf" maxlength="14" placeholder="000.000.000-00" />
              </div>
              <div class="col-12 md:col-6">
                <label class="block mb-2">RG</label>
                <input pInputText [(ngModel)]="form.rg" name="rg" />
              </div>
              <div class="col-12 md:col-4">
                <label class="block mb-2">Cor / Raça</label>
                <p-dropdown [options]="dominios['corRaca']" [(ngModel)]="form.corRaca" name="corRaca"
                  optionLabel="nome" optionValue="codigo" placeholder="Selecione" [showClear]="true">
                </p-dropdown>
              </div>
              <div class="col-12 md:col-4">
                <label class="block mb-2">Pronome</label>
                <p-dropdown [options]="dominios['pronome']" [(ngModel)]="form.pronome" name="pronome"
                  optionLabel="nome" optionValue="codigo" placeholder="Selecione" [showClear]="true">
                </p-dropdown>
              </div>
              <div class="col-12 md:col-4">
                <label class="block mb-2">Identidade de Gênero</label>
                <p-dropdown [options]="dominios['identidadeGenero']" [(ngModel)]="form.identidadeGenero" name="identidadeGenero"
                  optionLabel="nome" optionValue="codigo" placeholder="Selecione" [showClear]="true">
                </p-dropdown>
              </div>
              <div class="col-12 md:col-6">
                <label class="block mb-2">Orientação Sexual</label>
                <p-dropdown [options]="dominios['orientacaoSexual']" [(ngModel)]="form.orientacaoSexual" name="orientacaoSexual"
                  optionLabel="nome" optionValue="codigo" placeholder="Selecione" [showClear]="true">
                </p-dropdown>
              </div>
              <div class="col-12 md:col-6">
                <label class="block mb-2">Descrição PCD</label>
                <input pInputText [(ngModel)]="form.descricaoPcd" name="descricaoPcd" placeholder="Se houver" />
              </div>
            </div>
          </p-card>

          <!-- Redes Sociais -->
          <p-card header="Redes Sociais" styleClass="mb-3">
            <div class="grid p-fluid">
              <div class="col-12 md:col-4">
                <label class="block mb-2">Instagram</label>
                <input pInputText [(ngModel)]="form.instagram" name="instagram" placeholder="@usuario" />
              </div>
              <div class="col-12 md:col-4">
                <label class="block mb-2">Facebook</label>
                <input pInputText [(ngModel)]="form.facebook" name="facebook" placeholder="facebook.com/usuario" />
              </div>
              <div class="col-12 md:col-4">
                <label class="block mb-2">LinkedIn</label>
                <input pInputText [(ngModel)]="form.linkedin" name="linkedin" placeholder="linkedin.com/in/usuario" />
              </div>
            </div>
          </p-card>

          <!-- Endereço -->
          <p-card header="Endereço" styleClass="mb-3">
            <div class="grid p-fluid">
              <div class="col-12 md:col-3">
                <label class="block mb-2">CEP</label>
                <input pInputText [(ngModel)]="form.cep" name="cep" maxlength="9" placeholder="00000-000" (blur)="buscarCep()" />
              </div>
              <div class="col-12 md:col-6">
                <label class="block mb-2">Rua</label>
                <input pInputText [(ngModel)]="form.rua" name="rua" />
              </div>
              <div class="col-12 md:col-3">
                <label class="block mb-2">Número</label>
                <input pInputText [(ngModel)]="form.numero" name="numero" />
              </div>
              <div class="col-12 md:col-4">
                <label class="block mb-2">Bairro</label>
                <input pInputText [(ngModel)]="form.bairro" name="bairro" />
              </div>
              <div class="col-12 md:col-4">
                <label class="block mb-2">Cidade</label>
                <input pInputText [(ngModel)]="form.cidade" name="cidade" />
              </div>
              <div class="col-12 md:col-2">
                <label class="block mb-2">Estado</label>
                <input pInputText [(ngModel)]="form.estado" name="estado" maxlength="2" />
              </div>
              <div class="col-12 md:col-2">
                <label class="block mb-2">Complemento</label>
                <input pInputText [(ngModel)]="form.complemento" name="complemento" />
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
  `]
})
export class PerfilPessoalComponent implements OnInit {
  carregando = true;
  salvando = false;

  form: PerfilPessoalRequest = {};

  dominios: Record<string, DominioDto[]> = {
    corRaca: [], pronome: [], identidadeGenero: [], orientacaoSexual: [],
  };

  constructor(
    private candidatoService: CandidatoService,
    private dominioService: DominioService,
    private notificationService: NotificationService,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.carregarDominios();
    this.carregarPerfil();
  }

  private carregarDominios(): void {
    this.dominioService.buscarPorTipo(DominioTipo.CorRaca).subscribe(d => this.dominios['corRaca'] = d);
    this.dominioService.buscarPorTipo(DominioTipo.Pronome).subscribe(d => this.dominios['pronome'] = d);
    this.dominioService.buscarPorTipo(DominioTipo.IdentidadeGenero).subscribe(d => this.dominios['identidadeGenero'] = d);
    this.dominioService.buscarPorTipo(DominioTipo.OrientacaoSexual).subscribe(d => this.dominios['orientacaoSexual'] = d);
  }

  private carregarPerfil(): void {
    this.candidatoService.obterPerfilPessoal()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (p) => {
          this.form = {
            sobreMim: p.sobreMim ?? undefined,
            localResidencia: p.localResidencia ?? undefined,
            cpf: p.cpf ?? undefined,
            rg: p.rg ?? undefined,
            corRaca: p.corRaca,
            pronome: p.pronome,
            identidadeGenero: p.identidadeGenero,
            orientacaoSexual: p.orientacaoSexual,
            descricaoPcd: p.descricaoPcd ?? undefined,
            instagram: p.instagram ?? undefined,
            facebook: p.facebook ?? undefined,
            linkedin: p.linkedin ?? undefined,
            cep: p.endereco?.cep ?? undefined,
            rua: p.endereco?.rua ?? undefined,
            numero: p.endereco?.numero ?? undefined,
            bairro: p.endereco?.bairro ?? undefined,
            cidade: p.endereco?.cidade ?? undefined,
            estado: p.endereco?.estado ?? undefined,
            complemento: p.endereco?.complemento ?? undefined,
          };
        },
        error: () => this.carregando = false,
      });
  }

  buscarCep(): void {
    const cep = this.form.cep?.replace(/\D/g, '');
    if (cep?.length !== 8) return;
    this.http.get<any>(`${environment.apiUrl}/External/cep/${cep}`).subscribe({
      next: (r) => {
        if (r.sucesso && r.valor) {
          this.form.rua = r.valor.logradouro || this.form.rua;
          this.form.bairro = r.valor.bairro || this.form.bairro;
          this.form.cidade = r.valor.localidade || this.form.cidade;
          this.form.estado = r.valor.uf || this.form.estado;
        }
      }
    });
  }

  salvar(): void {
    this.salvando = true;
    this.candidatoService.salvarPerfilPessoal(this.form)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.notificationService.success('Sucesso', 'Perfil pessoal salvo com sucesso!');
          this.router.navigate(['/candidatos/dashboard']);
        },
        error: (e) => this.notificationService.error('Erro', e.message),
      });
  }

  voltar(): void {
    this.router.navigate(['/candidatos/dashboard']);
  }
}
