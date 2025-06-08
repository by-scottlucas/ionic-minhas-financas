import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { TransactionCategoryEnum } from 'src/app/models/enums/transaction/transaction-category.enum';
import { TransactionTypeEnum } from 'src/app/models/enums/transaction/transaction-type.enum';

export const LIST_TRANSACTIONS_MOCK = [
  {
    title: 'Compra Mercado',
    date: new Date('2024-06-15T00:00:00Z'),
    type: TransactionTypeEnum.WithDrawal,
    category: TransactionCategoryEnum.Food,
    paymentMethod: PaymentMethodEnum.CREDIT_CARD,
    price: 120,
  },
  {
    title: 'Salário',
    date: new Date('2024-06-01T00:00:00Z'),
    type: TransactionTypeEnum.Entry,
    category: TransactionCategoryEnum.Salary,
    paymentMethod: PaymentMethodEnum.PIX,
    price: 5000,
  },
  {
    title: 'Cinema',
    date: new Date('2024-07-10T00:00:00Z'),
    type: TransactionTypeEnum.WithDrawal,
    category: TransactionCategoryEnum.Leisure,
    paymentMethod: PaymentMethodEnum.DEBIT_CARD,
    price: 50,
  },
  {
    title: 'Presente Aniversário',
    date: new Date('2023-01-20T00:00:00Z'),
    type: TransactionTypeEnum.WithDrawal,
    category: TransactionCategoryEnum.Shopping,
    paymentMethod: PaymentMethodEnum.DEBIT_CARD,
    price: 80,
  },
];
