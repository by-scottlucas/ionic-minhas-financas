import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { TransactionDTO } from '../models/transaction.dto';
import { SqliteService } from 'src/app/core/database/sqlite.service';

const STORAGE_KEY = 'transactions';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private _transactionsChanged = new Subject<void>();
  transactionsChanged$ = this._transactionsChanged.asObservable();

  constructor(private sqliteService: SqliteService) {}

  async listTransactions(): Promise<TransactionDTO[]> {
    if (this.sqliteService.isWeb()) {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }

    const db = await this.sqliteService.getDB();

    const result = await db.query(`
      SELECT id, title, type, price, category, paymentMethod, date, cardId
      FROM transactions
      ORDER BY id DESC
    `);

    const rows = result.values ?? [];

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      price: row.price,
      category: row.category,
      paymentMethod: row.paymentMethod,
      date: row.date,
      cardId: row.cardId ?? undefined,
    }));
  }

  async createTransaction(data: TransactionDTO): Promise<number> {
    if (this.sqliteService.isWeb()) {
      const list = await this.listTransactions();
      const newId =
        list.length > 0 ? Math.max(...list.map((t) => t.id ?? 0)) + 1 : 1;

      list.push({ ...data, id: newId });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

      this._transactionsChanged.next();
      return newId;
    }

    const db = await this.sqliteService.getDB();

    const result = await db.run(
      `INSERT INTO transactions
       (title, type, price, category, paymentMethod, date, cardId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.type,
        data.price,
        data.category,
        data.paymentMethod,
        data.date,
        data.cardId ?? null,
      ]
    );

    this._transactionsChanged.next();
    return result.changes?.lastId ?? -1;
  }

  async updateTransaction(data: TransactionDTO): Promise<number> {
    if (!data.id) {
      throw new Error('ID da transação é obrigatório.');
    }

    if (this.sqliteService.isWeb()) {
      const list = await this.listTransactions();
      const index = list.findIndex((t) => t.id === data.id);
      if (index === -1) return 0;

      list[index] = { ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

      this._transactionsChanged.next();
      return 1;
    }

    const db = await this.sqliteService.getDB();

    const result = await db.run(
      `UPDATE transactions
       SET title = ?, type = ?, price = ?, category = ?, paymentMethod = ?, date = ?, cardId = ?
       WHERE id = ?`,
      [
        data.title,
        data.type,
        data.price,
        data.category,
        data.paymentMethod,
        data.date,
        data.cardId ?? null,
        data.id,
      ]
    );

    const changes = result.changes?.changes ?? 0;

    if (changes > 0) {
      this._transactionsChanged.next();
    }

    return changes;
  }

  async deleteTransaction(id: number): Promise<number> {
    if (this.sqliteService.isWeb()) {
      const list = await this.listTransactions();
      const newList = list.filter((t) => t.id !== id);

      const deleted = list.length !== newList.length;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));

      if (deleted) {
        this._transactionsChanged.next();
      }

      return deleted ? 1 : 0;
    }

    const db = await this.sqliteService.getDB();

    const result = await db.run(`DELETE FROM transactions WHERE id = ?`, [id]);

    const changes = result.changes?.changes ?? 0;

    if (changes > 0) {
      this._transactionsChanged.next();
    }

    return changes;
  }
}
