import { Injectable } from '@angular/core';
import { TransactionDTO } from 'src/app/models/transaction.dto';

@Injectable({
  providedIn: 'root',
})
export class FilterBarService {

  filterTransactions(
    transactions: TransactionDTO[],
    searchTerm: string,
    advancedFilters: any
  ): TransactionDTO[] {
    let filtered = [...transactions];

    if (searchTerm && searchTerm.trim() !== '') {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter((transaction) =>
        transaction.title?.toLowerCase().includes(lower)
      );
    }

    if (advancedFilters) {
      const { month, year, type, category, paymentMethod, minValue, maxValue } =
        advancedFilters;

      if (month) {
        filtered = filtered.filter(
          (transaction) =>
            new Date(transaction.date).getMonth() + 1 === Number(month)
        );
      }

      if (year) {
        filtered = filtered.filter(
          (transaction) =>
            new Date(transaction.date).getFullYear() === Number(year)
        );
      }

      if (type) {
        filtered = filtered.filter((transaction) => transaction.type === type);
      }

      if (category) {
        filtered = filtered.filter(
          (transaction) => transaction.category === category
        );
      }

      if (paymentMethod) {
        filtered = filtered.filter(
          (transaction) => transaction.paymentMethod === paymentMethod
        );
      }

      if (minValue != null && minValue !== '') {
        filtered = filtered.filter(
          (transaction) => transaction.price >= Number(minValue)
        );
      }

      if (maxValue != null && maxValue !== '') {
        filtered = filtered.filter(
          (transaction) => transaction.price <= Number(maxValue)
        );
      }
    }

    return filtered;
  }
}
