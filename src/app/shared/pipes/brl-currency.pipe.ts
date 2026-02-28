import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'brlCurrency',
  standalone: true,
})
export class BrlCurrencyPipe implements PipeTransform {

  private currencyPipe = new CurrencyPipe('pt-BR');

  transform(value: number | null | undefined): string | null {
    if (value == null) return null;

    return this.currencyPipe.transform(
      value,
      'BRL',
      'symbol-narrow',
      '1.2-2',
      'pt-BR'
    );
  }
}
