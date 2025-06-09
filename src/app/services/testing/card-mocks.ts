import { CardDTO } from 'src/app/models/card.dto';
import { CardBrandEnum } from 'src/app/models/enums/card/card-brand.enum';
import { CardTypeEnum } from 'src/app/models/enums/card/card-type.enum';

export const LIST_CARDS_MOCK: CardDTO[] = [
  {
    id: 1,
    title: 'Cartão Nubank',
    type: CardTypeEnum.CREDIT_CARD,
    cardLimit: 150,
    cardUsage: 50,
    dueDate: 9,
    brand: CardBrandEnum.MASTERCARD,
    lastDigits: 3867,
  },
  {
    id: 2,
    title: 'Cartão Internacional',
    type: CardTypeEnum.CREDIT_CARD,
    cardLimit: 650,
    cardUsage: 0,
    dueDate: 18,
    brand: CardBrandEnum.AMERICAN_EXPRESS,
    lastDigits: 3225,
  },
  {
    id: 3,
    title: 'Cartão C6 Bank',
    type: CardTypeEnum.CREDIT_CARD,
    cardLimit: 150,
    cardUsage: 50,
    dueDate: 25,
    brand: CardBrandEnum.VISA,
    lastDigits: 6719,
  },
];

export const CREATE_CARD_MOCK: CardDTO = {
  title: 'Cartão Agibank',
  type: CardTypeEnum.CREDIT_CARD,
  cardLimit: 250,
  cardUsage: 0,
  dueDate: 4,
  brand: CardBrandEnum.MASTERCARD,
  lastDigits: 3868,
};

export const UPDATE_CARD_MOCK: CardDTO = {
    id: 3,
    title: 'Cartão C6 Bank',
    type: CardTypeEnum.CREDIT_CARD,
    cardLimit: 350,
    cardUsage: 0,
    dueDate: 22,
    brand: CardBrandEnum.VISA,
    lastDigits: 6719,
};
