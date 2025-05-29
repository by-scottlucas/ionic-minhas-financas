import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared/shared.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  balanceTitle = 'Saldo do Mês';
  balanceValue = 7000.25;

  firstTitle = 'Entradas';
  firstValue = 100.25;
  firstValuePositive = true;

  secondTitle = 'Saídas';
  secondValue = 49.9;
  secondValuePositive = false;
}
