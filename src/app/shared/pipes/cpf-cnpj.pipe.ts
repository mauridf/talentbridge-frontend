import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatar CPF e CNPJ
 *
 * Uso:
 * {{ '12345678901' | cpfCnpj }}  → 123.456.789-01
 * {{ '12345678901234' | cpfCnpj }} → 12.345.678/9012-34
 */
@Pipe({
  name: 'cpfCnpj',
  standalone: true,
})
export class CpfCnpjPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';

    // Remove caracteres não numéricos
    const numeros = value.replace(/\D/g, '');

    // CPF: 11 dígitos
    if (numeros.length === 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // CNPJ: 14 dígitos
    if (numeros.length === 14) {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    // Se não for CPF nem CNPJ, retorna como está
    return value;
  }
}
