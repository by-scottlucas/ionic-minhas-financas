export enum PaymentMethodEnum {
  PIX = 'pix',
  MONEY = 'money',
  DEBIT_CARD = 'debit_card',
  CREDIT_CARD = 'credit_card',
}

export const PaymentMethodEnumLabels: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.PIX]: 'Pix',
  [PaymentMethodEnum.MONEY]: 'Dinheiro',
  [PaymentMethodEnum.DEBIT_CARD]: 'Cartão de Débito',
  [PaymentMethodEnum.CREDIT_CARD]: 'Cartão de Crédito',
};
