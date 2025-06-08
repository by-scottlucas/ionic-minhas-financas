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
