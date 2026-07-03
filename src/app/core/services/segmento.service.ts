import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ResultadoDto } from '../models/resultado.dto';

export interface Segmento {
  id: string;
  nome: string;
  descricao: string;
}

@Injectable({ providedIn: 'root' })
export class SegmentoService {
  private readonly apiUrl = `${environment.apiUrl}/api/Segmento`;
  private http = inject(HttpClient);

  listar(): Observable<Segmento[]> {
    return this.http.get<ResultadoDto<Segmento[]> | Segmento[]>(this.apiUrl).pipe(
      map((res) => {
        if (Array.isArray(res)) return res;
        if (res.sucesso && res.valor) return res.valor;
        throw new Error(res.erros?.[0]?.mensagem || 'Erro ao listar segmentos');
      }),
    );
  }
}
