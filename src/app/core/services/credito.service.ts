import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ResultadoDto } from '../models/resultado.dto';

export interface CreditosResponse {
  empresaId: string;
  empresaNome: string;
  totalCreditos: number;
  creditosUsados: number;
  creditosDisponiveis: number;
  creditosPorProduto: CreditoPorProduto[];
}

export interface CreditoPorProduto {
  produtoId: string;
  nomeProduto: string;
  creditos: number;
}

export interface ProdutoResponse {
  id: string;
  nomeProduto: string;
  descricaoProduto?: string;
  valorProduto: number;
  quantidadeCreditoPorVaga: number;
  quantidadeCandidatos?: number;
}

@Injectable({ providedIn: 'root' })
export class CreditoService {
  private readonly apiUrl = `${environment.apiUrl}/api/Credito`;

  constructor(private http: HttpClient) {}

  saldoEmpresa(empresaId: string): Observable<CreditosResponse> {
    return this.http
      .get<ResultadoDto<CreditosResponse>>(`${this.apiUrl}/empresa/${empresaId}`)
      .pipe(map((r) => this.extrair(r)));
  }

  listarProdutos(): Observable<ProdutoResponse[]> {
    return this.http
      .get<ProdutoResponse[]>(`${environment.apiUrl}/Produto`)
      .pipe();
  }

  adminAdicionar(empresaId: string, quantidade: number, motivo?: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/Admin/Adicionar`, null, {
        params: { empresaId, quantidade, motivo: motivo || '' },
      });
  }

  adminRemover(empresaId: string, quantidade: number, motivo?: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/Admin/Remover`, null, {
        params: { empresaId, quantidade, motivo: motivo || '' },
      });
  }

  private extrair<T>(response: ResultadoDto<T>): T {
    if (!response.sucesso || response.valor === null || response.valor === undefined) {
      throw new Error(response.erros?.[0]?.mensagem || 'Erro na requisição');
    }
    return response.valor;
  }
}