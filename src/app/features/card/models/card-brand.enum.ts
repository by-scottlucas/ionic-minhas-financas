export enum CardBrandEnum {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  ELO = 'elo',
  AMERICAN_EXPRESS = 'american_express',
  OTHER = 'other',
}

export const CardBrandLabels: Record<
  CardBrandEnum,
  string
> = {
  [CardBrandEnum.VISA]: 'Visa',
  [CardBrandEnum.MASTERCARD]: 'Mastercard',
  [CardBrandEnum.ELO]: 'Elo',
  [CardBrandEnum.AMERICAN_EXPRESS]: 'American Express',
  [CardBrandEnum.OTHER]: 'Outra',
}
