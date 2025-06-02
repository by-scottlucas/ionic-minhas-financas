import { CardBrandEnum } from './enums/card/card-brand.enum';
import { CardTypeEnum } from './enums/card/card-type.enum';

export interface CardDTO{
  title: string;
  type: CardTypeEnum;
  limit?: number;
  dueDate: number;
  brand: CardBrandEnum;
  lastDigits: number;
}
