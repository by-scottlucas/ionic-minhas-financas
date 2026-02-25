import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { TransactionCategoryEnum } from 'src/app/models/enums/transaction/transaction-category.enum';
import { TransactionTypeEnum } from 'src/app/models/enums/transaction/transaction-type.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';

export const NEW_TRANSACTION_MOCK = {
  title: 'Nova',
  type: TransactionTypeEnum.Entry,
  price: 50,
  category: TransactionCategoryEnum.Others,
  date: new Date().toISOString(),
  paymentMethod: PaymentMethodEnum.PIX,
  creditCard: null,
};

export const EDIT_TRANSACTION_MOCK = {
  title: 'Editar',
  type: TransactionTypeEnum.Entry,
  price: 50,
  category: TransactionCategoryEnum.Others,
  date: new Date().toISOString(),
  paymentMethod: PaymentMethodEnum.PIX,
  creditCard: null,
};

export const CREATE_TRANSACTION_CREDIT_CARD_MOCK: TransactionDTO = {
  id: 1,
  title: 'Transaction 1',
  type: TransactionTypeEnum.Entry,
  price: 500,
  date: new Date('2024-06-15T00:00:00Z'),
  category: TransactionCategoryEnum.Food,
  paymentMethod: PaymentMethodEnum.CREDIT_CARD,
  cardId: 1,
};
