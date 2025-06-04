import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Subject } from 'rxjs';

import { TransactionDTO } from '../models/transaction.dto';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'transactions';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private _transactionsChanged = new Subject<void>();
  transactionsChanged$ = this._transactionsChanged.asObservable();

  constructor(private storageService: StorageService) {}

  private async ensureTable(db: SQLiteDBConnection): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        paymentMethod TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `;
    await db.execute(createTableQuery);
  }

  async listTransactions(): Promise<TransactionDTO[]> {
    if (this.storageService.isRunningOnWeb()) {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: TransactionDTO[] = raw ? JSON.parse(raw) : [];
      return parsed;
    }

    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const result = await db.query(
      'SELECT id, title, type, price, category, paymentMethod, date FROM transactions ORDER BY id DESC'
    );
    const rows = result.values ?? [];

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      price: row.price,
      category: row.category,
      paymentMethod: row.paymentMethod,
      date: row.date,
    }));
  }

  async createTransaction(data: TransactionDTO): Promise<number> {
    if (this.storageService.isRunningOnWeb()) {
      const list = await this.listTransactions();
      const newId =
        list.length > 0 ? Math.max(...list.map((t) => t.id ?? 0)) + 1 : 1;
      const newTransaction = { ...data, id: newId };
      list.push(newTransaction);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this._transactionsChanged.next();
      return newId;
    }

    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `
      INSERT INTO transactions (title, type, price, category, paymentMethod, date)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const values = [
      data.title,
      data.type,
      data.price,
      data.category,
      data.paymentMethod,
      data.date,
    ];

    try {
      const result = await db.run(query, values);
      this._transactionsChanged.next();
      return result.changes?.lastId ?? -1;
    } catch (error) {
      console.error('TransactionService - Erro ao criar transação:', error);
      throw error;
    }
  }

  async updateTransaction(data: TransactionDTO): Promise<number> {
    if (!data.id)
      throw new Error('ID da transação é obrigatório para atualização.');

    if (this.storageService.isRunningOnWeb()) {
      const list = await this.listTransactions();
      const index = list.findIndex((t) => t.id === data.id);
      if (index === -1) return 0;
      list[index] = { ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      this._transactionsChanged.next();
      return 1;
    }

    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `
      UPDATE transactions
      SET title = ?, type = ?, price = ?, category = ?, paymentMethod = ?, date = ?
      WHERE id = ?;
    `;

    const values = [
      data.title,
      data.type,
      data.price,
      data.category,
      data.paymentMethod,
      data.date,
      data.id,
    ];

    try {
      const result = await db.run(query, values);
      this._transactionsChanged.next();
      return result.changes?.changes ?? 0;
    } catch (error) {
      console.error('TransactionService - Erro ao atualizar transação:', error);
      throw error;
    }
  }

  async deleteTransaction(id: number): Promise<number> {
    if (this.storageService.isRunningOnWeb()) {
      const list = await this.listTransactions();
      const newList = list.filter((t) => t.id !== id);
      const deleted = list.length !== newList.length;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      if (deleted) {
        this._transactionsChanged.next();
      }
      return deleted ? 1 : 0;
    }

    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `DELETE FROM transactions WHERE id = ?;`;

    try {
      const result = await db.run(query, [id]);
      if (result.changes?.changes && result.changes.changes > 0) {
        this._transactionsChanged.next();
      }
      return result.changes?.changes ?? 0;
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  }
}
