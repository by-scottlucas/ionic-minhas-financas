import { Injectable } from '@angular/core';

import { AdvancedFilterDTO } from './models/advaced-filter.dto';
import { TransactionDTO } from 'src/app/features/wallet/models/transaction.dto';


@Injectable({
  providedIn: 'root',
})
export class FilterBarService {
  filterTransactions(
    transactions: TransactionDTO[],
    searchTerm: string,
    advancedFilters: AdvancedFilterDTO
  ): TransactionDTO[] {
    let filtered = [...transactions];

    if (searchTerm && searchTerm.trim() !== '') {
      filtered = this.filterBySearchTerm(filtered, searchTerm);
    }

    if (advancedFilters) {
      filtered = this.applyAdvancedFilters(filtered, advancedFilters);
    }

    return filtered;
  }

  private filterBySearchTerm(
    transactions: TransactionDTO[],
    searchTerm: string
  ): TransactionDTO[] {
    const lower = searchTerm.toLowerCase();
    return transactions.filter((transaction) =>
      transaction.title?.toLowerCase().includes(lower)
    );
  }

  private applyAdvancedFilters(
    transactions: TransactionDTO[],
    filters: any
  ): TransactionDTO[] {
    let filtered = [...transactions];
    const { month, year, type, category, paymentMethod, minValue, maxValue } =
      filters;

    if (month) filtered = this.filterByMonth(filtered, month);
    if (year) filtered = this.filterByYear(filtered, year);
    if (type) filtered = this.filterByType(filtered, type);
    if (category) filtered = this.filterByCategory(filtered, category);
    if (paymentMethod)
      filtered = this.filterByPaymentMethod(filtered, paymentMethod);
    if (minValue != null && minValue !== '')
      filtered = this.filterByMinValue(filtered, minValue);
    if (maxValue != null && maxValue !== '')
      filtered = this.filterByMaxValue(filtered, maxValue);

    return filtered;
  }

  private filterByMonth(
    transactions: TransactionDTO[],
    month: number
  ): TransactionDTO[] {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionUTCMonth = transactionDate.getUTCMonth() + 1;
      return transactionUTCMonth === Number(month);
    });
  }

  private filterByYear(
    transactions: TransactionDTO[],
    year: number
  ): TransactionDTO[] {
    return transactions.filter(
      (transaction) =>
        new Date(transaction.date).getUTCFullYear() === Number(year)
    );
  }

  private filterByType(
    transactions: TransactionDTO[],
    type: string
  ): TransactionDTO[] {
    return transactions.filter((transaction) => transaction.type === type);
  }

  private filterByCategory(
    transactions: TransactionDTO[],
    category: string
  ): TransactionDTO[] {
    return transactions.filter(
      (transaction) => transaction.category === category
    );
  }

  private filterByPaymentMethod(
    transactions: TransactionDTO[],
    paymentMethod: string
  ): TransactionDTO[] {
    return transactions.filter(
      (transaction) => transaction.paymentMethod === paymentMethod
    );
  }

  private filterByMinValue(
    transactions: TransactionDTO[],
    minValue: number
  ): TransactionDTO[] {
    return transactions.filter(
      (transaction) => transaction.price >= Number(minValue)
    );
  }

  private filterByMaxValue(
    transactions: TransactionDTO[],
    maxValue: number
  ): TransactionDTO[] {
    return transactions.filter(
      (transaction) => transaction.price <= Number(maxValue)
    );
  }
}
