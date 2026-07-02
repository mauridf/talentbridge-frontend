/**
 * DTOs relacionados à autenticação
 * Baseado no contrato da API: POST /Usuario/Autenticar
 */

/** Request para login */
export interface LoginRequestDto {
  email: string;
  senha: string;
}

/** Response quando login tem apenas 1 perfil e 1 empresa */
export interface LoginResponseDto {
  accessToken: string;
  nome: string;
  email: string;
  perfil: string; // Código do perfil: "CANDIDATO", "GESTOR_EMPRESA", "RECRUTADOR", "ADMIN"
  empresaId?: string; // GUID da empresa (se aplicável)
  empresaNome?: string; // Nome da empresa
}

/** Perfil disponível quando multi-perfil */
export interface PerfilDisponivelDto {
  perfilCodigo: string;
  perfilNome: string;
}

/** Empresa disponível quando multi-empresa */
export interface EmpresaDisponivelDto {
  empresaId: string;
  empresaNome: string;
}

/** Response quando usuário tem múltiplos perfis ou empresas */
export interface LoginMultiPerfilResponseDto {
  multiPerfil: boolean;
  multiEmpresa: boolean;
  perfisDisponiveis: PerfilDisponivelDto[];
  empresas: EmpresaDisponivelDto[];
  tokenTemporario: string;
}

/** Request para selecionar perfil (multi-perfil) */
export interface SelecionarPerfilRequestDto {
  tokenTemporario: string;
  perfilCodigo: string;
}

/** Request para selecionar empresa (multi-empresa) */
export interface SelecionarEmpresaRequestDto {
  idEmpresa: string;
}

/** Response do refresh token */
export interface RefreshTokenResponseDto {
  accessToken: string;
}

/** Claims extraídas do JWT decodificado */
export interface JwtClaims {
  id: string; // GUID do usuário
  perfil: string; // Código do perfil
  funcionalidades: string; // Separadas por vírgula
  operacoes: string; // Separadas por vírgula
  nome: string; // Nome do usuário
  idEmpresa?: string; // GUID da empresa (se houver)
  exp: number; // Timestamp de expiração
  iat: number; // Timestamp de emissão
}

/** Perfis de usuário disponíveis no sistema */
export enum PerfilUsuario {
  ADMIN = 'ADMIN',
  GESTOR_EMPRESA = 'GESTOR_EMPRESA',
  RECRUTADOR = 'RECRUTADOR',
  CANDIDATO = 'CANDIDATO',
}

/** Status de autenticação do usuário atual */
export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  claims: JwtClaims | null;
  perfil: PerfilUsuario | null;
  nome: string;
  email: string;
  empresaId: string | null;
  empresaNome: string | null;
}
