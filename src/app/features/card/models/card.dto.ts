import { CardBrandEnum } from "./card-brand.enum";
import { CardTypeEnum } from "./card-type.enum";

export interface CardDTO {
  id?: number;
  title: string;
  type: CardTypeEnum;
  cardLimit?: number;
  cardUsage?: number;
  dueDate?: number;
  brand: CardBrandEnum;
  lastDigits: number;
}
