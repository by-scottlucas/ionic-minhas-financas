import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BalanceHeaderData } from './models/balance-header.model';

@Component({
  selector: 'app-balance-header',
  templateUrl: './balance-header.component.html',
  styleUrls: ['./balance-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceHeaderComponent {
  @Input({ required: true }) data!: BalanceHeaderData;

  getModifierClass(base: string, isPositive: boolean): string {
    return `${base}--${isPositive ? 'positive' : 'negative'}`;
  }
}
