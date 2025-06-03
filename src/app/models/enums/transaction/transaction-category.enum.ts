export enum TransactionCategoryEnum {
  Food = 'food',
  Transport = 'transport',
  Housing = 'housing',
  Health = 'health',
  Education = 'education',
  Leisure = 'leisure',
  Shopping = 'shopping',
  Services = 'services',
  Salary = 'salary',
  Freelance = 'freelance',
  Others = 'others',
}

export const TransactionCategoryLabels: Record<
  TransactionCategoryEnum,
  string
> = {
  [TransactionCategoryEnum.Food]: 'Alimentação',
  [TransactionCategoryEnum.Transport]: 'Transporte',
  [TransactionCategoryEnum.Housing]: 'Moradia',
  [TransactionCategoryEnum.Health]: 'Saúde',
  [TransactionCategoryEnum.Education]: 'Educação',
  [TransactionCategoryEnum.Leisure]: 'Lazer',
  [TransactionCategoryEnum.Shopping]: 'Compras',
  [TransactionCategoryEnum.Services]: 'Serviços',
  [TransactionCategoryEnum.Salary]: 'Salário',
  [TransactionCategoryEnum.Freelance]: 'Freelancer',
  [TransactionCategoryEnum.Others]: 'Outros',
};
