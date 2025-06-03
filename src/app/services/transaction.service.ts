import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { TransactionDTO } from '../models/transaction.dto';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {

  constructor(private storageService: StorageService) {}

  private async ensureTable(db: SQLiteDBConnection): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        paymentMethod TEXT NOT NULL
      );
    `;
    await db.execute(createTableQuery);
  }

  async listTransactions(): Promise<TransactionDTO[]> {
    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const result = await db.query(
      'SELECT * FROM transactions ORDER BY date DESC'
    );
    const rows = result.values ?? [];

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      price: row.price,
      category: row.category,
      date: new Date(row.date),
      paymentMethod: row.paymentMethod,
    }));
  }

  async createTransaction(transaction: TransactionDTO): Promise<number> {
    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `
      INSERT INTO transactions (title, type, price, category, date, paymentMethod)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const values = [
      transaction.title,
      transaction.type,
      transaction.price,
      transaction.category,
      transaction.date.toISOString(),
      transaction.paymentMethod,
    ];

    try {
      const result = await db.run(query, values);
      return result.changes?.lastId ?? -1;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  }

  async updateTransaction(transaction: TransactionDTO): Promise<number> {
    if (!transaction.id) {
      throw new Error('ID da transação é obrigatório para atualização.');
    }

    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `
      UPDATE transactions
      SET title = ?, type = ?, price = ?, category = ?, date = ?, paymentMethod = ?
      WHERE id = ?;
    `;

    const values = [
      transaction.title,
      transaction.type,
      transaction.price,
      transaction.category,
      transaction.date.toISOString(),
      transaction.paymentMethod,
      transaction.id,
    ];

    try {
      const result = await db.run(query, values);
      return result.changes?.changes ?? 0;
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  }

  async deleteTransaction(id: number): Promise<number> {
    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `DELETE FROM transactions WHERE id = ?;`;

    try {
      const result = await db.run(query, [id]);
      return result.changes?.changes ?? 0;
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  }
}
