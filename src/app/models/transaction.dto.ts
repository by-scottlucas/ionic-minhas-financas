import { CategoryEnum } from './enums/category.enum';
import { PaymentMethodEnum } from './enums/payment-method.enum';
import { TypeEnum } from './enums/type.enum';

export interface TransactionDTO {
  title: string;
  type: TypeEnum;
  price: number;
  category: CategoryEnum;
  date: Date;
  paymentMethod: PaymentMethodEnum
}
