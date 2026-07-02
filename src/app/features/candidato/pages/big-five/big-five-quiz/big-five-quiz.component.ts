import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BigFiveService, BigFivePergunta } from '../../../services/big-five.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-big-five-quiz',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    RadioButtonModule,
  ],
  templateUrl: './big-five-quiz.component.html',
  styleUrls: ['./big-five-quiz.component.scss'],
})
export class BigFiveQuizComponent implements OnInit {
  perguntas: BigFivePergunta[] = [];
  respostas: Record<number, number> = {};
  perguntaAtual = 0;
  carregando = false;
  enviando = false;

  // Opções da escala Likert
  opcoes = [
    { valor: 1, label: 'Discordo totalmente' },
    { valor: 2, label: 'Discordo' },
    { valor: 3, label: 'Neutro' },
    { valor: 4, label: 'Concordo' },
    { valor: 5, label: 'Concordo totalmente' },
  ];

  constructor(
    private bigFiveService: BigFiveService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.perguntas = this.bigFiveService.perguntas;
  }

  /**
   * Retorna o progresso em porcentagem
   */
  get progresso(): number {
    return Math.round(((this.perguntaAtual + 1) / this.perguntas.length) * 100);
  }

  /**
   * Verifica se a pergunta atual foi respondida
   */
  get perguntaRespondida(): boolean {
    const pergunta = this.perguntas[this.perguntaAtual];
    return !!this.respostas[pergunta?.id];
  }

  /**
   * Verifica se é a primeira pergunta
   */
  get isPrimeira(): boolean {
    return this.perguntaAtual === 0;
  }

  /**
   * Verifica se é a última pergunta
   */
  get isUltima(): boolean {
    return this.perguntaAtual === this.perguntas.length - 1;
  }

  /**
   * Vai para a próxima pergunta
   */
  proxima(): void {
    if (this.perguntaAtual < this.perguntas.length - 1) {
      this.perguntaAtual++;
    }
  }

  /**
   * Volta para a pergunta anterior
   */
  anterior(): void {
    if (this.perguntaAtual > 0) {
      this.perguntaAtual--;
    }
  }

  /**
   * Seleciona uma resposta para a pergunta atual
   */
  responder(valor: number): void {
    const pergunta = this.perguntas[this.perguntaAtual];
    this.respostas[pergunta.id] = valor;
  }

  /**
   * Verifica se todas as perguntas foram respondidas
   */
  get todasRespondidas(): boolean {
    return this.perguntas.every((p) => !!this.respostas[p.id]);
  }

  /**
   * Quantas perguntas faltam responder
   */
  get perguntasFaltando(): number {
    return this.perguntas.filter((p) => !this.respostas[p.id]).length;
  }

  /**
   * Finaliza o teste e envia os resultados
   */
  finalizar(): void {
    if (!this.todasRespondidas) {
      this.notificationService.warn(
        'Atenção',
        `Ainda faltam ${this.perguntasFaltando} perguntas para responder.`,
      );
      return;
    }

    this.enviando = true;
    const resultado = this.bigFiveService.calcularEscores(this.respostas);

    this.bigFiveService
      .salvarResultado(resultado)
      .pipe(finalize(() => (this.enviando = false)))
      .subscribe({
        next: (response) => {
          this.notificationService.success(
            'Teste Concluído!',
            'Seus resultados foram salvos com sucesso.',
          );
          this.router.navigate(['/candidatos/resultado-big-five']);
        },
        error: (error) => {
          this.notificationService.error(
            'Erro',
            error.message || 'Erro ao salvar resultado do teste.',
          );
        },
      });
  }

  /**
   * Retorna nome amigável do traço
   */
  getNomeTraco(traco?: string): string {
    const nomes: Record<string, string> = {
      extroversao: 'Extroversão',
      amabilidade: 'Amabilidade',
      consciencia: 'Consciência',
      estabilidadeEmocional: 'Estabilidade Emocional',
      aberturaExperiencia: 'Abertura à Experiência',
    };
    return nomes[traco || ''] || '';
  }
}
