import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { TransactionCategoryEnum } from 'src/app/models/enums/transaction/transaction-category.enum';
import { TransactionTypeEnum } from 'src/app/models/enums/transaction/transaction-type.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';

export const LIST_TRANSACTIONS_MOCK: TransactionDTO[] = [
  {
    id: 1,
    title: 'Compra Mercado',
    date: new Date('2025-06-11T00:00:00Z'),
    type: TransactionTypeEnum.WithDrawal,
    category: TransactionCategoryEnum.Food,
    paymentMethod: PaymentMethodEnum.CREDIT_CARD,
    price: 120,
    cardId: null!,
  },
  {
    id: 2,
    title: 'Salário',
    date: new Date('2025-06-11T00:00:00Z'),
    type: TransactionTypeEnum.Entry,
    category: TransactionCategoryEnum.Salary,
    paymentMethod: PaymentMethodEnum.PIX,
    price: 5000,
    cardId: null!,
  },
  {
    id: 3,
    title: 'Cinema',
    date: new Date('2024-07-10T00:00:00Z'),
    type: TransactionTypeEnum.WithDrawal,
    category: TransactionCategoryEnum.Leisure,
    paymentMethod: PaymentMethodEnum.DEBIT_CARD,
    price: 50,
    cardId: null!,
  },
  {
    id: 4,
    title: 'Presente Aniversário',
    date: new Date('2023-01-20T00:00:00Z'),
    type: TransactionTypeEnum.WithDrawal,
    category: TransactionCategoryEnum.Shopping,
    paymentMethod: PaymentMethodEnum.DEBIT_CARD,
    price: 80,
    cardId: null!,
  },
];

export const CREATE_TRANSACTION_MOCK: TransactionDTO = {
  id: 5,
  title: 'Compra Mercado',
  date: new Date('2024-06-15T00:00:00Z'),
  type: TransactionTypeEnum.WithDrawal,
  category: TransactionCategoryEnum.Food,
  paymentMethod: PaymentMethodEnum.CREDIT_CARD,
  price: 120,
  cardId: null!,
};

export const UPDATE_TRANSACTION_MOCK: TransactionDTO = {
  id: 3, // existente no LIST_TRANSACTIONS_MOCK
  title: 'Compra Mercado Assaí',
  date: new Date('2024-06-16T00:00:00Z'),
  type: TransactionTypeEnum.WithDrawal,
  category: TransactionCategoryEnum.Food,
  paymentMethod: PaymentMethodEnum.CREDIT_CARD,
  price: 120,
  cardId: null!,
};

export const DELETE_TRANSACTION_MOCK: TransactionDTO = {
  id: 1,
  title: 'Compra Mercado Assaí',
  date: new Date('2024-06-16T00:00:00Z'),
  type: TransactionTypeEnum.WithDrawal,
  category: TransactionCategoryEnum.Food,
  paymentMethod: PaymentMethodEnum.CREDIT_CARD,
  price: 120,
  cardId: null!,
};
