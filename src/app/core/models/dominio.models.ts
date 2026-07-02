/**
 * Modelos para os domínios (tabelas de lookup)
 * Endpoint: GET /Dominio/{tipo}
 */

/** Item de domínio retornado pela API */
export interface DominioDto {
  id: number;
  codigo: number;
  nome: string;
  tipo: number;
  ativo: boolean;
}

/** Tipos de domínio disponíveis (parâmetro {tipo} na URL) */
export enum DominioTipo {
  RegimeTrabalho = 0,
  VagaAfirmativa = 1,
  TipoContratacao = 2,
  JornadaTrabalho = 3,
  FormacaoAcademica = 4,
  AreaAtuacao = 5,
  TempoExperiencia = 6,
  IdentidadeGenero = 7,
  OrientacaoSexual = 8,
  Pronome = 9,
  CorRaca = 10,
  AreaInteresse = 11,
  OrigemCadastro = 12,
}

/** Mapeamento amigável dos tipos de domínio */
export const DOMINIO_NOMES: Record<DominioTipo, string> = {
  [DominioTipo.RegimeTrabalho]: 'Regime de Trabalho',
  [DominioTipo.VagaAfirmativa]: 'Ações Afirmativas',
  [DominioTipo.TipoContratacao]: 'Tipo de Contratação',
  [DominioTipo.JornadaTrabalho]: 'Jornada de Trabalho',
  [DominioTipo.FormacaoAcademica]: 'Formação Acadêmica',
  [DominioTipo.AreaAtuacao]: 'Área de Atuação',
  [DominioTipo.TempoExperiencia]: 'Tempo de Experiência',
  [DominioTipo.IdentidadeGenero]: 'Identidade de Gênero',
  [DominioTipo.OrientacaoSexual]: 'Orientação Sexual',
  [DominioTipo.Pronome]: 'Pronome',
  [DominioTipo.CorRaca]: 'Cor/Raça',
  [DominioTipo.AreaInteresse]: 'Área de Interesse',
  [DominioTipo.OrigemCadastro]: 'Origem de Cadastro',
};

/** Cache de domínios (armazenado em memória) */
export interface DominioCache {
  [tipo: number]: {
    data: DominioDto[];
    timestamp: number;
    ttl: number; // Time to live em milissegundos
  };
}
