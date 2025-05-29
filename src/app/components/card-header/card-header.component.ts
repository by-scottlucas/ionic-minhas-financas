import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
})
export class CardHeaderComponent {
  @Input() balanceTitle!: string;
  @Input() balanceValue!: number;

  @Input() firstTitle!: string;
  @Input() firstValue!: number;
  @Input() firstValuePositive!: boolean;

  @Input() secondTitle!: string;
  @Input() secondValue!: number;
  @Input() secondValuePositive!: boolean;
}
