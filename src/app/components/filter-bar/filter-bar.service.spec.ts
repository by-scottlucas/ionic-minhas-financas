import { TestBed } from '@angular/core/testing';
import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { TransactionCategoryEnum } from 'src/app/models/enums/transaction/transaction-category.enum';
import { TransactionTypeEnum } from 'src/app/models/enums/transaction/transaction-type.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';

import { FilterBarService } from './filter-bar.service';
import { AdvancedFilterDTO } from './models/advaced-filter.dto';
import { ADVANCED_FILTER_MOCK } from './testing/advanced-filter.mock';
import { LIST_TRANSACTIONS_MOCK } from './testing/list-transaction-mock';

describe('FilterBarService', () => {
  let service: FilterBarService;
  let transactions: TransactionDTO[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterBarService);
    transactions = LIST_TRANSACTIONS_MOCK;
  });

  it('should be create', () => {
    expect(service).toBeTruthy();
  });

  it('should return all transactions if no filters are applied', () => {
    const result = service.filterTransactions(transactions, '', {});
    expect(result.length).toBe(4);
  });

  it('should filter by search term in title', () => {
    const result = service.filterTransactions(transactions, 'mercado', {});
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Compra Mercado');
  });

  it('should filter by month', () => {
    const filters: AdvancedFilterDTO = { month: 6 };
    const result = service.filterTransactions(transactions, '', filters);
    expect(result.length).toBe(2);
    expect(
      result.some((transaction) => transaction.title === 'Compra Mercado')
    ).toBeTrue();
    expect(
      result.some((transaction) => transaction.title === 'Salário')
    ).toBeTrue();
  });

  it('should filter by year', () => {
    const filters: AdvancedFilterDTO = { year: 2024 };
    const result = service.filterTransactions(transactions, '', filters);
    expect(result.length).toBe(3);
    expect(
      result.every(
        (transaction) => new Date(transaction.date).getFullYear() === 2024
      )
    ).toBeTrue();
  });

  it('should filter by type', () => {
    const filters: AdvancedFilterDTO = { type: TransactionTypeEnum.Entry };
    const result = service.filterTransactions(transactions, '', filters);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe(TransactionTypeEnum.Entry);
  });

  it('should filter by category', () => {
    const filters: AdvancedFilterDTO = {
      category: TransactionCategoryEnum.Leisure,
    };
    const result = service.filterTransactions(transactions, '', filters);
    expect(result.length).toBe(1);
    expect(result[0].category).toBe(TransactionCategoryEnum.Leisure);
  });

  it('should filter by payment method', () => {
    const filters: AdvancedFilterDTO = {
      paymentMethod: PaymentMethodEnum.DEBIT_CARD,
    };
    const result = service.filterTransactions(transactions, '', filters);
    expect(result.length).toBe(2);
    expect(
      result.some((transaction) => transaction.title === 'Cinema')
    ).toBeTrue();
    expect(
      result.some((transaction) => transaction.title === 'Presente Aniversário')
    ).toBeTrue();
  });

  it('should filter by minimum value', () => {
    const filters: AdvancedFilterDTO = { minValue: 100 };
    const result = service.filterTransactions(transactions, '', filters);
    expect(result.length).toBe(2);
    expect(result.some((transaction) => transaction.price === 120)).toBeTrue();
    expect(result.some((transaction) => transaction.price === 5000)).toBeTrue();
  });

  it('should filter by maximum value', () => {
    const filters: AdvancedFilterDTO = { maxValue: 100 };
    const result = service.filterTransactions(transactions, '', filters);
    expect(result.length).toBe(2);
    expect(result.some((transaction) => transaction.price === 50)).toBeTrue();
    expect(result.some((transaction) => transaction.price === 80)).toBeTrue();
  });

  it('should apply multiple filters at the same time', () => {
    const filters = ADVANCED_FILTER_MOCK;

    const result = service.filterTransactions(transactions, '', filters);
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Compra Mercado');
  });

  it('should return empty if no transaction matches the filters', () => {
    const filters: AdvancedFilterDTO = {
      type: 'investimento' as TransactionTypeEnum,
    };
    const result = service.filterTransactions(transactions, '', filters);
    expect(result.length).toBe(0);
  });
});
