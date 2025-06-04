import { CardBrandEnum } from './enums/card/card-brand.enum';
import { CardTypeEnum } from './enums/card/card-type.enum';

export interface CardDTO {
  id?: number;
  title: string;
  type: CardTypeEnum;
  cardLimit?: number;
  dueDate?: number;
  brand: CardBrandEnum;
  lastDigits: number;
}
