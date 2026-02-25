
import { PaymentMethodEnum } from './payment-method.enum';
import { TransactionCategoryEnum } from './transaction-category.enum';
import { TransactionTypeEnum } from './transaction-type.enum';

export interface TransactionDTO {
  id?: number;
  title: string;
  type: TransactionTypeEnum;
  price: number;
  category: TransactionCategoryEnum;
  date: Date;
  paymentMethod: PaymentMethodEnum;
  cardId?: number;
}
