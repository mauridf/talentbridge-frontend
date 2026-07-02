/**
 * Interface que representa o padrão de resposta da API
 * O backend sempre retorna { sucesso, valor, erros }
 */
export interface ResultadoDto<T> {
  sucesso: boolean;
  valor: T | null;
  erros: ErroDto[] | null;
}

/**
 * Interface para erros retornados pela API
 * Ex: { codigo: "CANDIDATO_NAO_ENCONTRADO", mensagem: "Candidato não encontrado." }
 */
export interface ErroDto {
  codigo: string;
  mensagem: string;
}

/**
 * Type guard para verificar se uma resposta é bem-sucedida
 * Uso: if (isSuccess(resposta)) { const dados = resposta.valor; }
 */
export function isSuccess<T>(
  resultado: ResultadoDto<T>,
): resultado is ResultadoDto<T> & { valor: T } {
  return resultado.sucesso === true && resultado.valor !== null;
}

/**
 * Type guard para verificar se houve erro
 */
export function isError<T>(
  resultado: ResultadoDto<T>,
): resultado is ResultadoDto<T> & { erros: ErroDto[] } {
  return resultado.sucesso === false && resultado.erros !== null;
}
