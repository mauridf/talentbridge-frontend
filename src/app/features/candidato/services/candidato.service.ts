import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResultadoDto } from '../../../core/models/resultado.dto';

export interface CriarCandidatoRequest {
  nome: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
  dataNascimento: string;
  telefone: string;
  nomeSocial?: string;
  codigoParceiro?: string;
}

export interface CandidatoResponse {
  id: string;
  nome: string;
  nomeSocial?: string;
  email: string;
  telefone?: string;
  dataNascimento: string;
  status: string;
  realizouBigFive: boolean;
  dataUltimoTesteBigFive?: string;
}

export interface EditarCandidatoRequest {
  nome?: string;
  nomeSocial?: string;
  telefone?: string;
  dataNascimento?: string;
}

export interface PerfilPessoalRequest {
  corRaca?: number | null;
  pronome?: number | null;
  identidadeGenero?: number | null;
  orientacaoSexual?: number | null;
  cpf?: string | null;
  rg?: string | null;
  sobreMim?: string | null;
  localResidencia?: string | null;
  acoesAfirmativas?: string | null;
  descricaoPcd?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  cep?: string | null;
  rua?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  complemento?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface EnderecoDto {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string;
  latitude?: number;
  longitude?: number;
}

export interface PerfilPessoalResponse {
  corRaca: number | null;
  pronome: number | null;
  identidadeGenero: number | null;
  orientacaoSexual: number | null;
  cpf: string | null;
  rg: string | null;
  sobreMim: string | null;
  localResidencia: string | null;
  acoesAfirmativas: string | null;
  descricaoPcd: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  endereco: EnderecoDto | null;
}

export interface CompetenciaCandidatoDto {
  competenciaId: string;
  nivel: number;
}

export interface FormacaoAcademicaDto {
  grau?: string;
  areaAtuacao?: string;
  instituicao?: string;
  dataConclusao?: string;
  concluido?: boolean;
}

export interface ExperienciaProfissionalDto {
  empresa?: string;
  posicao?: string;
  dataInicio?: string;
  dataFim?: string | null;
  empregoAtual?: boolean;
  descricao?: string;
}

export interface PerfilProfissionalRequest {
  dispensaExperienciaProfissional?: boolean;
  competencias?: CompetenciaCandidatoDto[];
  formacoesAcademicas?: FormacaoAcademicaDto[];
  experienciasProfissionais?: ExperienciaProfissionalDto[];
  areasInteresse?: number[];
}

export interface PerfilProfissionalResponse {
  id: string;
  dispensaExperienciaProfissional: boolean;
  competencias: CompetenciaCandidatoDto[];
  formacoesAcademicas: FormacaoAcademicaDto[];
  experienciasProfissionais: ExperienciaProfissionalDto[];
  areasInteresse: number[];
}

@Injectable({ providedIn: 'root' })
export class CandidatoService {
  private readonly apiUrl = `${environment.apiUrl}/Candidato`;

  constructor(private http: HttpClient) {}

  criar(request: CriarCandidatoRequest): Observable<CandidatoResponse> {
    return this.http.post<ResultadoDto<CandidatoResponse>>(this.apiUrl, request).pipe(
      map((r) => this.extrair(r)),
    );
  }

  buscar(porId?: string, porEmail?: string): Observable<CandidatoResponse> {
    const params = new URLSearchParams();
    if (porId) params.set('id', porId);
    if (porEmail) params.set('email', porEmail);
    return this.http.get<ResultadoDto<CandidatoResponse>>(`${this.apiUrl}?${params}`).pipe(
      map((r) => this.extrair(r)),
    );
  }

  editar(request: EditarCandidatoRequest): Observable<CandidatoResponse> {
    return this.http.put<ResultadoDto<CandidatoResponse>>(this.apiUrl, request).pipe(
      map((r) => this.extrair(r)),
    );
  }

  confirmarEmail(email: string, token: string): Observable<void> {
    return this.http.post<ResultadoDto<void>>(`${this.apiUrl}/confirmarEmail`, { email, token }).pipe(
      map((r) => { if (!r.sucesso) throw new Error(r.erros?.[0]?.mensagem || 'Erro'); }),
    );
  }

  reenviarConfirmacaoEmail(email: string): Observable<void> {
    return this.http.post<ResultadoDto<void>>(`${this.apiUrl}/reenviarConfirmacaoEmail`, { email }).pipe(
      map((r) => { if (!r.sucesso) throw new Error(r.erros?.[0]?.mensagem || 'Erro'); }),
    );
  }

  obterPerfilPessoal(): Observable<PerfilPessoalResponse> {
    return this.http.get<ResultadoDto<PerfilPessoalResponse>>(`${this.apiUrl}/perfil-pessoal`).pipe(
      map((r) => this.extrair(r)),
    );
  }

  salvarPerfilPessoal(request: PerfilPessoalRequest): Observable<PerfilPessoalResponse> {
    return this.http.post<ResultadoDto<PerfilPessoalResponse>>(`${this.apiUrl}/perfil-pessoal/upsert`, request).pipe(
      map((r) => this.extrair(r)),
    );
  }

  obterPerfilProfissional(): Observable<PerfilProfissionalResponse> {
    return this.http.get<ResultadoDto<PerfilProfissionalResponse>>(`${this.apiUrl}/perfil-profissional`).pipe(
      map((r) => this.extrair(r)),
    );
  }

  salvarPerfilProfissional(request: PerfilProfissionalRequest): Observable<PerfilProfissionalResponse> {
    return this.http.post<ResultadoDto<PerfilProfissionalResponse>>(`${this.apiUrl}/perfil-profissional/upsert`, request).pipe(
      map((r) => this.extrair(r)),
    );
  }

  private extrair<T>(response: ResultadoDto<T>): T {
    if (!response.sucesso || response.valor === null || response.valor === undefined) {
      throw new Error(response.erros?.[0]?.mensagem || 'Erro na requisição');
    }
    return response.valor;
  }
}
