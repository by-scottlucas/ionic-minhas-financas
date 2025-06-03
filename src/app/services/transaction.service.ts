import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { TransactionDTO } from '../models/transaction.dto';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'financeDB';

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initDB() {
    if (this.db) return;

    try {
      this.db = await this.sqlite.createConnection(
        this.dbName,
        false,
        'no-encryption',
        1,
        false
      );
      await this.db.open();

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
      await this.db.execute(createTableQuery);
    } catch (error) {
      console.error('Erro ao inicializar banco:', error);
      throw error;
    }
  }

  async listTransactions(): Promise<TransactionDTO[]> {
    await this.initDB();

    const query = 'SELECT * FROM transactions ORDER BY date DESC';
    const result = await this.db?.query(query);

    const rows = result?.values ?? [];

    return rows.map((row) => ({
      title: row.title,
      type: row.type,
      price: row.price,
      category: row.category,
      date: new Date(row.date),
      paymentMethod: row.paymentMethod,
    }));
  }

  async createTransaction(transaction: TransactionDTO) {
    await this.initDB();

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
      await this.db?.run(query, values);
    } catch (error) {
      throw error;
    }
  }
}
