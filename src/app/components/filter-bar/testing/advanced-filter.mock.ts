import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { TransactionCategoryEnum } from 'src/app/models/enums/transaction/transaction-category.enum';
import { TransactionTypeEnum } from 'src/app/models/enums/transaction/transaction-type.enum';

import { AdvancedFilterDTO } from '../models/advaced-filter.dto';

export const ADVANCED_FILTER_MOCK: AdvancedFilterDTO = {
  month: 6,
  year: 2024,
  type: TransactionTypeEnum.WithDrawal,
  category: TransactionCategoryEnum.Food,
  paymentMethod: PaymentMethodEnum.CREDIT_CARD,
  minValue: 100,
  maxValue: 150,
};

export const MOCK_FILTERS_INITIAL: AdvancedFilterDTO = {
  month: 1,
  year: 2025,
  type: TransactionTypeEnum.WithDrawal,
  category: TransactionCategoryEnum.Food,
  paymentMethod: PaymentMethodEnum.MONEY,
  minValue: 10,
  maxValue: 100,
};

export const MOCK_FILTERS_APPLY: AdvancedFilterDTO = {
  month: 2,
  year: 2024,
  type: TransactionTypeEnum.Entry,
  category: TransactionCategoryEnum.Salary,
  paymentMethod: PaymentMethodEnum.DEBIT_CARD,
  minValue: 100,
  maxValue: 500,
};

export const MOCK_FILTERS_CLEAR: AdvancedFilterDTO = {
  month: 3,
  year: 2023,
  type: TransactionTypeEnum.WithDrawal,
  category: TransactionCategoryEnum.Transport,
  paymentMethod: PaymentMethodEnum.MONEY,
  minValue: 5,
  maxValue: 50,
};

export const MOCK_FILTERS_RESET: AdvancedFilterDTO = {
  month: null!,
  year: null!,
  type: null!,
  category: null!,
  paymentMethod: null!,
  minValue: null!,
  maxValue: null!,
};
