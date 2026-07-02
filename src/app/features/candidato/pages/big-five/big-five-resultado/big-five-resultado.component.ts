import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { BigFiveService, BigFiveResponse } from '../../../services/big-five.service';

@Component({
  selector: 'app-big-five-resultado',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, ChartModule],
  template: `
    <div class="page-container fade-in" style="max-width: 900px; margin: 0 auto;">
      <div class="card" style="text-align: center; padding: 2rem;">
        <i class="pi pi-verified" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: 0.5rem;"></i>
        <h2>Resultado do Teste Big Five</h2>
        <p style="color: var(--text-color-secondary);">
          @if (resultado?.dataUltimoTeste) {
            Realizado em {{ resultado!.dataUltimoTeste | date: "dd/MM/yyyy 'às' HH:mm" }}
          }
        </p>
      </div>

      @if (resultado) {
        <div class="grid">
          <div class="col-12 md:col-7">
            <div class="card">
              <h3 class="text-center">Perfil Comportamental</h3>
              <div style="height: 350px;">
                <p-chart type="radar" [data]="dadosGrafico" [options]="opcoesGrafico"></p-chart>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-5">
            <div class="card">
              <h3>Pontuações</h3>
              @for (t of tracos; track t.key) {
                <div class="flex align-items-center justify-content-between mb-3">
                  <span style="font-weight: 600; flex: 1;">{{ t.label }}</span>
                  <span class="mr-2 font-bold" [style.color]="getBarColor(t.valor)">{{ t.valor }}%</span>
                  <div style="width: 100px; height: 8px; background: var(--surface-border); border-radius: 4px; overflow: hidden;">
                    <div [style.width.%]="t.valor" [style.background]="getBarColor(t.valor)" style="height: 100%; border-radius: 4px; transition: width 0.5s;"></div>
                  </div>
                </div>
              }
            </div>

            <div class="card" *ngIf="tracoDominante">
              <h3>Traço Dominante</h3>
              <p style="font-size: 1.2rem; font-weight: 700; color: var(--primary-color);">{{ tracoDominante.label }}</p>
              <p style="color: var(--text-color-secondary);">{{ tracoDominante.descricao }}</p>
            </div>
          </div>
        </div>
      } @else {
        <div class="card text-center" style="padding: 3rem;">
          <i class="pi pi-info-circle" style="font-size: 3rem; color: var(--warning-color); margin-bottom: 1rem;"></i>
          <h3>Nenhum resultado encontrado</h3>
          <p style="color: var(--text-color-secondary); margin-bottom: 1.5rem;">
            Você ainda não realizou o teste Big Five. Faça o teste para ver seus resultados aqui.
          </p>
          <p-button label="Fazer Teste" icon="pi pi-chart-bar" routerLink="/candidatos/teste-big-five"></p-button>
        </div>
      }

      <div class="text-center mt-3">
        <p-button label="Voltar ao Dashboard" icon="pi pi-arrow-left" severity="secondary" routerLink="/candidatos/dashboard"></p-button>
      </div>
    </div>
  `,
  styles: [`
    .mb-3 { margin-bottom: 1rem; }
    .text-center { text-align: center; }
  `]
})
export class BigFiveResultadoComponent implements OnInit {
  resultado: BigFiveResponse | null = null;
  dadosGrafico: any;
  opcoesGrafico: any;

  tracos = [
    { key: 'extroversao', label: 'Extroversão', valor: 0, descricao: 'Tendência a ser sociável, comunicativo e energético.' },
    { key: 'amabilidade', label: 'Amabilidade', valor: 0, descricao: 'Tendência a ser cooperativo, compassivo e amigável.' },
    { key: 'consciencia', label: 'Consciência', valor: 0, descricao: 'Tendência a ser organizado, responsável e disciplinado.' },
    { key: 'estabilidadeEmocional', label: 'Estabilidade Emocional', valor: 0, descricao: 'Capacidade de lidar com estresse e manter equilíbrio.' },
    { key: 'aberturaExperiencia', label: 'Abertura à Experiência', valor: 0, descricao: 'Tendência a ser criativo, curioso e aberto a novas ideias.' },
  ];

  constructor(private bigFiveService: BigFiveService) {}

  ngOnInit(): void {
    this.resultado = this.bigFiveService.ultimoResultado;

    if (this.resultado) {
      this.tracos = this.tracos.map((t) => ({
        ...t,
        valor: this.resultado![t.key as keyof BigFiveResponse] as number,
      }));

      this.dadosGrafico = {
        labels: this.tracos.map((t) => t.label),
        datasets: [
          {
            label: 'Seu Perfil',
            data: this.tracos.map((t) => t.valor),
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3B82F6',
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#3B82F6',
          },
        ],
      };

      this.opcoesGrafico = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20 },
          },
        },
        plugins: {
          legend: { display: false },
        },
      };
    }
  }

  get tracoDominante(): (typeof this.tracos)[0] | null {
    if (this.tracos.length === 0) return null;
    return this.tracos.reduce((max, t) => (t.valor > max.valor ? t : max));
  }

  getBarColor(valor: number): string {
    if (valor >= 70) return '#22C55E';
    if (valor >= 50) return '#3B82F6';
    if (valor >= 30) return '#F59E0B';
    return '#EF4444';
  }
}
