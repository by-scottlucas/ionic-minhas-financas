import { PaymentMethodEnum } from './enums/transaction/payment-method.enum';
import { TransactionCategoryEnum } from './enums/transaction/transaction-category.enum';
import { TransactionTypeEnum } from './enums/transaction/transaction-type.enum';

export interface TransactionDTO {
  title: string;
  type: TransactionTypeEnum;
  price: number;
  category: TransactionCategoryEnum;
  date: Date;
  paymentMethod: PaymentMethodEnum
}
