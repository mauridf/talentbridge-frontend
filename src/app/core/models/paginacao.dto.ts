/**
 * Interface para requisições paginadas
 * Enviado no body de POST que retornam listas paginadas
 */
export interface PaginacaoRequestDto {
  pageNumber: number;
  pageSize: number;
  filter?: any;
}

/**
 * Metadata da paginação retornada pelo backend
 */
export interface PaginacaoMetadata {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Interface genérica para respostas paginadas
 * O backend retorna { data: [...], metaData: {...} }
 */
export interface PaginacaoResponseDto<T> {
  data: T[];
  metaData: PaginacaoMetadata;
}

/**
 * Helper para criar uma requisição paginada padrão
 */
export function createPaginacaoRequest(
  pageNumber: number = 1,
  pageSize: number = 10,
  filter?: any,
): PaginacaoRequestDto {
  return {
    pageNumber,
    pageSize,
    filter: filter || {},
  };
}
