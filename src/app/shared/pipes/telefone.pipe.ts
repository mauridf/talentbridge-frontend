import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatar telefones brasileiros
 *
 * Uso:
 * {{ '11999999999' | telefone }} → (11) 99999-9999
 * {{ '1133333333' | telefone }}  → (11) 3333-3333
 * {{ '08001234567' | telefone }} → 0800 123 4567
 */
@Pipe({
  name: 'telefone',
  standalone: true,
})
export class TelefonePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';

    // Remove caracteres não numéricos
    const numeros = value.replace(/\D/g, '');

    // 0800
    if (numeros.startsWith('0800') && numeros.length === 11) {
      return numeros.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    }

    // Celular com DDD: 11 dígitos
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    // Telefone fixo com DDD: 10 dígitos
    if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    // Telefone sem DDD: 8 ou 9 dígitos
    if (numeros.length === 8) {
      return numeros.replace(/(\d{4})(\d{4})/, '$1-$2');
    }

    if (numeros.length === 9) {
      return numeros.replace(/(\d{5})(\d{4})/, '$1-$2');
    }

    // Retorna como está se não reconhecer o formato
    return value;
  }
}
