import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResultadoDto } from '../../../core/models/resultado.dto';

export interface BigFiveRequest {
  extroversao: number;
  amabilidade: number;
  consciencia: number;
  estabilidadeEmocional: number;
  aberturaExperiencia: number;
}

export interface BigFiveResponse {
  extroversao: number;
  amabilidade: number;
  consciencia: number;
  estabilidadeEmocional: number;
  aberturaExperiencia: number;
  dataUltimoTeste: string;
  realizouTeste: boolean;
}

/**
 * Perguntas do teste Big Five (44 perguntas - versão reduzida)
 * Escala Likert: 1 (Discordo totalmente) a 5 (Concordo totalmente)
 */
export interface BigFivePergunta {
  id: number;
  texto: string;
  traco:
    'extroversao' | 'amabilidade' | 'consciencia' | 'estabilidadeEmocional' | 'aberturaExperiencia';
  reverso: boolean; // Se true, inverter escore (6 - valor)
}

@Injectable({
  providedIn: 'root',
})
export class BigFiveService {
  private readonly apiUrl = `${environment.apiUrl}/Candidato/bigfive`;

  // 44 perguntas do Big Five (10 por traço, algumas compartilhadas)
  readonly perguntas: BigFivePergunta[] = [
    // Extroversão (8 perguntas)
    {
      id: 1,
      texto: 'Eu sou uma pessoa comunicativa e expansiva.',
      traco: 'extroversao',
      reverso: false,
    },
    {
      id: 6,
      texto: 'Eu tendo a ser uma pessoa quieta e reservada.',
      traco: 'extroversao',
      reverso: true,
    },
    {
      id: 11,
      texto: 'Eu gosto de estar cercado de pessoas e de atividades sociais.',
      traco: 'extroversao',
      reverso: false,
    },
    {
      id: 16,
      texto: 'Eu prefiro fazer atividades sozinho(a) do que em grupo.',
      traco: 'extroversao',
      reverso: true,
    },
    {
      id: 21,
      texto: 'Eu me sinto energizado(a) em situações sociais.',
      traco: 'extroversao',
      reverso: false,
    },
    {
      id: 26,
      texto: 'Eu geralmente tomo a iniciativa em conversas.',
      traco: 'extroversao',
      reverso: false,
    },
    {
      id: 31,
      texto: 'Eu não me importo em ser o centro das atenções.',
      traco: 'extroversao',
      reverso: false,
    },
    {
      id: 36,
      texto: 'Eu prefiro ambientes calmos e tranquilos.',
      traco: 'extroversao',
      reverso: true,
    },

    // Amabilidade (9 perguntas)
    {
      id: 2,
      texto: 'Eu me preocupo com o bem-estar das outras pessoas.',
      traco: 'amabilidade',
      reverso: false,
    },
    {
      id: 7,
      texto: 'Eu tendo a desconfiar das intenções dos outros.',
      traco: 'amabilidade',
      reverso: true,
    },
    {
      id: 12,
      texto: 'Eu gosto de ajudar os outros sempre que posso.',
      traco: 'amabilidade',
      reverso: false,
    },
    {
      id: 17,
      texto: 'Eu às vezes sou frio(a) e distante com as pessoas.',
      traco: 'amabilidade',
      reverso: true,
    },
    {
      id: 22,
      texto: 'Eu evito conflitos e busco harmonia nos relacionamentos.',
      traco: 'amabilidade',
      reverso: false,
    },
    {
      id: 27,
      texto: 'Eu tendo a perdoar os erros dos outros com facilidade.',
      traco: 'amabilidade',
      reverso: false,
    },
    {
      id: 32,
      texto: 'Eu posso ser crítico(a) e encontrar defeitos nos outros.',
      traco: 'amabilidade',
      reverso: true,
    },
    {
      id: 37,
      texto: 'Eu me importo genuinamente com os sentimentos alheios.',
      traco: 'amabilidade',
      reverso: false,
    },
    {
      id: 41,
      texto: 'Eu acredito que a maioria das pessoas tem boas intenções.',
      traco: 'amabilidade',
      reverso: false,
    },

    // Consciência (9 perguntas)
    {
      id: 3,
      texto: 'Eu sou uma pessoa organizada e metódica.',
      traco: 'consciencia',
      reverso: false,
    },
    { id: 8, texto: 'Eu às vezes deixo tarefas incompletas.', traco: 'consciencia', reverso: true },
    {
      id: 13,
      texto: 'Eu presto atenção aos detalhes no meu trabalho.',
      traco: 'consciencia',
      reverso: false,
    },
    {
      id: 18,
      texto: 'Eu tendo a ser desorganizado(a) e bagunceiro(a).',
      traco: 'consciencia',
      reverso: true,
    },
    {
      id: 23,
      texto: 'Eu cumpro minhas obrigações e compromissos pontualmente.',
      traco: 'consciencia',
      reverso: false,
    },
    {
      id: 28,
      texto: 'Eu sou disciplinado(a) e persistente nos meus objetivos.',
      traco: 'consciencia',
      reverso: false,
    },
    {
      id: 33,
      texto: 'Eu às vezes ajo por impulso sem pensar nas consequências.',
      traco: 'consciencia',
      reverso: true,
    },
    {
      id: 38,
      texto: 'Eu gosto de planejar e seguir uma rotina estruturada.',
      traco: 'consciencia',
      reverso: false,
    },
    {
      id: 42,
      texto: 'Eu faço meu trabalho com dedicação e esforço.',
      traco: 'consciencia',
      reverso: false,
    },

    // Estabilidade Emocional (9 perguntas)
    {
      id: 4,
      texto: 'Eu geralmente me sinto calmo(a) e tranquilo(a).',
      traco: 'estabilidadeEmocional',
      reverso: false,
    },
    {
      id: 9,
      texto: 'Eu me preocupo excessivamente com as coisas.',
      traco: 'estabilidadeEmocional',
      reverso: true,
    },
    {
      id: 14,
      texto: 'Eu lido bem com situações de estresse e pressão.',
      traco: 'estabilidadeEmocional',
      reverso: false,
    },
    {
      id: 19,
      texto: 'Eu me sinto ansioso(a) com frequência.',
      traco: 'estabilidadeEmocional',
      reverso: true,
    },
    {
      id: 24,
      texto: 'Eu mantenho a calma mesmo em situações difíceis.',
      traco: 'estabilidadeEmocional',
      reverso: false,
    },
    {
      id: 29,
      texto: 'Eu tendo a ser uma pessoa otimista e bem-humorada.',
      traco: 'estabilidadeEmocional',
      reverso: false,
    },
    {
      id: 34,
      texto: 'Eu fico irritado(a) ou chateado(a) com facilidade.',
      traco: 'estabilidadeEmocional',
      reverso: true,
    },
    {
      id: 39,
      texto: 'Eu me recupero rapidamente de situações adversas.',
      traco: 'estabilidadeEmocional',
      reverso: false,
    },
    {
      id: 43,
      texto: 'Eu raramente me sinto triste ou deprimido(a).',
      traco: 'estabilidadeEmocional',
      reverso: false,
    },

    // Abertura à Experiência (9 perguntas)
    {
      id: 5,
      texto: 'Eu tenho uma imaginação ativa e criativa.',
      traco: 'aberturaExperiencia',
      reverso: false,
    },
    {
      id: 10,
      texto: 'Eu prefiro rotinas e coisas familiares a novidades.',
      traco: 'aberturaExperiencia',
      reverso: true,
    },
    {
      id: 15,
      texto: 'Eu tenho curiosidade sobre muitos assuntos diferentes.',
      traco: 'aberturaExperiencia',
      reverso: false,
    },
    {
      id: 20,
      texto: 'Eu gosto de experimentar coisas novas e diferentes.',
      traco: 'aberturaExperiencia',
      reverso: false,
    },
    {
      id: 25,
      texto: 'Eu tendo a ser conservador(a) e tradicional.',
      traco: 'aberturaExperiencia',
      reverso: true,
    },
    {
      id: 30,
      texto: 'Eu aprecio arte, música e expressões culturais.',
      traco: 'aberturaExperiencia',
      reverso: false,
    },
    {
      id: 35,
      texto: 'Eu prefiro tarefas simples e diretas.',
      traco: 'aberturaExperiencia',
      reverso: true,
    },
    {
      id: 40,
      texto: 'Eu gosto de aprender coisas novas constantemente.',
      traco: 'aberturaExperiencia',
      reverso: false,
    },
    {
      id: 44,
      texto: 'Eu tenho ideias inovadoras e gosto de pensar fora da caixa.',
      traco: 'aberturaExperiencia',
      reverso: false,
    },
  ];

  private _ultimoResultado: BigFiveResponse | null = null;

  get ultimoResultado(): BigFiveResponse | null {
    return this._ultimoResultado;
  }

  constructor(private http: HttpClient) {}

  /**
   * Salva o resultado do teste Big Five
   */
  salvarResultado(request: BigFiveRequest): Observable<BigFiveResponse> {
    return this.http.post<ResultadoDto<BigFiveResponse>>(this.apiUrl, request).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao salvar teste');
        }
        this._ultimoResultado = response.valor;
        return response.valor;
      }),
    );
  }

  /**
   * Calcula os escores do Big Five baseado nas respostas
   * @param respostas Mapa de id da pergunta -> valor da resposta (1-5)
   */
  calcularEscores(respostas: Record<number, number>): BigFiveRequest {
    const escores = {
      extroversao: 0,
      amabilidade: 0,
      consciencia: 0,
      estabilidadeEmocional: 0,
      aberturaExperiencia: 0,
    };

    const contagens = {
      extroversao: 0,
      amabilidade: 0,
      consciencia: 0,
      estabilidadeEmocional: 0,
      aberturaExperiencia: 0,
    };

    // Soma os escores de cada pergunta respondida
    this.perguntas.forEach((pergunta) => {
      const resposta = respostas[pergunta.id];
      if (resposta) {
        // Se for pergunta reversa, inverte o escore (6 - valor)
        const valor = pergunta.reverso ? 6 - resposta : resposta;
        escores[pergunta.traco] += valor;
        contagens[pergunta.traco]++;
      }
    });

    // Normaliza para escala 0-100
    return {
      extroversao: this.normalizar(escores.extroversao, contagens.extroversao),
      amabilidade: this.normalizar(escores.amabilidade, contagens.amabilidade),
      consciencia: this.normalizar(escores.consciencia, contagens.consciencia),
      estabilidadeEmocional: this.normalizar(
        escores.estabilidadeEmocional,
        contagens.estabilidadeEmocional,
      ),
      aberturaExperiencia: this.normalizar(
        escores.aberturaExperiencia,
        contagens.aberturaExperiencia,
      ),
    };
  }

  /**
   * Normaliza o escore para escala 0-100
   * Fórmula: (soma / (número de perguntas * 5)) * 100
   */
  private normalizar(soma: number, quantidade: number): number {
    if (quantidade === 0) return 0;
    const maximo = quantidade * 5;
    return Math.round((soma / maximo) * 100);
  }
}
