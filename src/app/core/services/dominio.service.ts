import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { DominioDto, DominioTipo, DominioCache } from '../models/dominio.models';
import { ResultadoDto } from '../models/resultado.dto';

/**
 * Serviço para carregar e cachear domínios (lookup tables)
 *
 * Estratégia de cache:
 * - Cache em memória com TTL de 30 minutos
 * - Usa shareReplay para evitar múltiplas chamadas simultâneas
 * - Domínios raramente mudam, então cache longo é seguro
 */
@Injectable({
  providedIn: 'root',
})
export class DominioService {
  private readonly apiUrl = environment.apiUrl;
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutos em ms

  // Cache em memória usando Map
  private cache = new Map<number, Observable<DominioDto[]>>();

  // Timestamps de quando cada tipo foi carregado
  private cacheTimestamps = new Map<number, number>();

  constructor(private http: HttpClient) {}

  /**
   * Busca domínios por tipo específico
   * Ex: GET /Dominio/0 (RegimeTrabalho)
   *
   * @param tipo Código do tipo de domínio
   * @returns Observable com array de domínios
   */
  buscarPorTipo(tipo: DominioTipo | number): Observable<DominioDto[]> {
    // Verifica se já está em cache e não expirou
    const cached = this.cache.get(tipo);
    const timestamp = this.cacheTimestamps.get(tipo);
    const agora = Date.now();

    if (cached && timestamp && agora - timestamp < this.CACHE_TTL) {
      return cached; // Retorna cache válido
    }

    // Busca da API com cache usando shareReplay
    const request$ = this.http
      .get<ResultadoDto<DominioDto[]>>(`${this.apiUrl}/Dominio/${tipo}`)
      .pipe(
        map((response) => {
          // Verifica se a resposta foi bem-sucedida
          if (!response.sucesso || !response.valor) {
            console.error(`Erro ao carregar domínios tipo ${tipo}:`, response.erros);
            return [];
          }
          return response.valor;
        }),
        // shareReplay(1) faz com que múltiplas subscrições compartilhem a mesma requisição
        shareReplay(1),
        tap((dominios) => {
          // Atualiza timestamp
          this.cacheTimestamps.set(tipo, Date.now());
        }),
      );

    // Armazena no cache
    this.cache.set(tipo, request$);
    return request$;
  }

  /**
   * Busca TODOS os domínios de uma vez
   * Ex: GET /Dominio
   *
   * @returns Observable com objeto agrupado por tipo
   */
  buscarTodos(): Observable<Record<number, DominioDto[]>> {
    return this.http.get<ResultadoDto<Record<number, DominioDto[]>>>(`${this.apiUrl}/Dominio`).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          console.error('Erro ao carregar todos os domínios:', response.erros);
          return {};
        }
        return response.valor;
      }),
      shareReplay(1),
    );
  }

  /**
   * Busca o nome de um domínio específico pelo código
   * Útil para exibir labels em vez de códigos
   *
   * @param tipo Tipo do domínio
   * @param codigo Código do item
   * @returns Observable com o nome ou string vazia
   */
  buscarNome(tipo: DominioTipo, codigo: number): Observable<string> {
    return this.buscarPorTipo(tipo).pipe(
      map((dominios) => {
        const encontrado = dominios.find((d) => d.codigo === codigo);
        return encontrado ? encontrado.nome : '';
      }),
    );
  }

  /**
   * Força a limpeza do cache (útil após atualizações)
   */
  limparCache(tipo?: DominioTipo): void {
    if (tipo !== undefined) {
      this.cache.delete(tipo);
      this.cacheTimestamps.delete(tipo);
    } else {
      this.cache.clear();
      this.cacheTimestamps.clear();
    }
  }

  /**
   * Pré-carrega domínios mais usados para melhorar UX
   * Chamar no app.component.ts ou após login
   */
  preCarregarDominiosComuns(): void {
    const dominiosComuns = [
      DominioTipo.RegimeTrabalho,
      DominioTipo.TipoContratacao,
      DominioTipo.JornadaTrabalho,
      DominioTipo.FormacaoAcademica,
      DominioTipo.AreaAtuacao,
      DominioTipo.TempoExperiencia,
    ];

    dominiosComuns.forEach((tipo) => {
      this.buscarPorTipo(tipo).subscribe();
    });
  }
}
