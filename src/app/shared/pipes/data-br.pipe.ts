import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Pipe para formatação de datas em português brasileiro
 * Usa date-fns para formatação
 *
 * Uso:
 * {{ '2026-07-01T00:00:00Z' | dataBr }}           → 01/07/2026
 * {{ '2026-07-01T14:30:00Z' | dataBr:'datetime' }} → 01/07/2026 14:30
 * {{ data | dataBr:'extenso' }}                    → 1 de julho de 2026
 * {{ data | dataBr:'relativo' }}                   → há 3 horas
 */
@Pipe({
  name: 'dataBr',
  standalone: true,
})
export class DataBrPipe implements PipeTransform {
  transform(
    value: string | Date | null,
    formato: 'data' | 'datetime' | 'hora' | 'extenso' | 'relativo' | 'iso' = 'data',
  ): string {
    if (!value) return '';

    // Converte string para Date se necessário
    let data: Date;
    if (typeof value === 'string') {
      data = parseISO(value);
    } else {
      data = value;
    }

    // Verifica se a data é válida
    if (!isValid(data)) {
      return String(value);
    }

    try {
      switch (formato) {
        case 'data':
          return format(data, 'dd/MM/yyyy');

        case 'datetime':
          return format(data, "dd/MM/yyyy 'às' HH:mm");

        case 'hora':
          return format(data, 'HH:mm');

        case 'extenso':
          return format(data, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

        case 'relativo':
          return this.formatarRelativo(data);

        case 'iso':
          return data.toISOString();

        default:
          return format(data, 'dd/MM/yyyy');
      }
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return String(value);
    }
  }

  /**
   * Formata data de forma relativa (ex: "há 3 horas", "há 2 dias")
   */
  private formatarRelativo(data: Date): string {
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffSegundos = Math.floor(diffMs / 1000);
    const diffMinutos = Math.floor(diffSegundos / 60);
    const diffHoras = Math.floor(diffMinutos / 60);
    const diffDias = Math.floor(diffHoras / 24);
    const diffMeses = Math.floor(diffDias / 30);
    const diffAnos = Math.floor(diffDias / 365);

    // Data futura
    if (diffMs < 0) {
      const absMs = Math.abs(diffMs);
      const absDias = Math.floor(absMs / (1000 * 60 * 60 * 24));

      if (absDias === 0) return 'hoje';
      if (absDias === 1) return 'amanhã';
      if (absDias < 7) return `em ${absDias} dias`;
      if (absDias < 30) return `em ${Math.ceil(absDias / 7)} semanas`;
      return format(data, 'dd/MM/yyyy');
    }

    // Data passada
    if (diffSegundos < 60) return 'agora mesmo';
    if (diffMinutos < 60) return `há ${diffMinutos} minuto${diffMinutos > 1 ? 's' : ''}`;
    if (diffHoras < 24) return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    if (diffDias < 7) return `há ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
    if (diffDias < 30)
      return `há ${Math.floor(diffDias / 7)} semana${Math.floor(diffDias / 7) > 1 ? 's' : ''}`;
    if (diffMeses < 12) return `há ${diffMeses} mês${diffMeses > 1 ? 'es' : ''}`;
    return `há ${diffAnos} ano${diffAnos > 1 ? 's' : ''}`;
  }
}
