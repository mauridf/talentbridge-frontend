import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ResultadoDto } from '../models/resultado.dto';

export interface CriarRecrutadorRequest {
  tokenConvite: string;
  nome: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
}

export interface CriarRecrutadorResponse {
  id: string;
  nome: string;
  email: string;
  empresaNome: string;
  mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class RecrutadorService {
  private readonly apiUrl = `${environment.apiUrl}/Recrutador`;
  private http = inject(HttpClient);

  criar(request: CriarRecrutadorRequest): Observable<CriarRecrutadorResponse> {
    return this.http.post<ResultadoDto<CriarRecrutadorResponse>>(this.apiUrl, request).pipe(
      map((response) => {
        if (!response.sucesso || !response.valor) {
          throw new Error(response.erros?.[0]?.mensagem || 'Erro ao criar recrutador');
        }
        return response.valor;
      }),
    );
  }
}
