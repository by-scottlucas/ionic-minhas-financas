import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-balance-header',
  templateUrl: './balance-header.component.html',
  styleUrls: ['./balance-header.component.scss'],
})
export class BalanceHeaderComponent {
  @Input() balanceTitle!: string;
  @Input() balanceValue!: number;
  @Input() balanceIcon!: string;

  @Input() firstTitle!: string;
  @Input() firstValue!: number;
  @Input() firstValuePositive!: boolean;

  @Input() secondTitle!: string;
  @Input() secondValue!: number;
  @Input() secondValuePositive!: boolean;
}
