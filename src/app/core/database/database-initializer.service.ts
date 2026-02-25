import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseInitializerService {
  constructor(private sqlite: SqliteService) {}

  async init(): Promise<void> {
    if (this.sqlite.isWeb()) return;

    const db = await this.sqlite.getDB();

    await this.createCardsTable(db);
    await this.createTransactionsTable(db);
  }

  private async createCardsTable(db: any): Promise<void> {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        cardLimit REAL,
        dueDate INTEGER,
        brand TEXT NOT NULL,
        lastDigits TEXT NOT NULL
      );
    `);
  }

  private async createTransactionsTable(db: any): Promise<void> {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        paymentMethod TEXT NOT NULL,
        date TEXT NOT NULL,
        cardId INTEGER,
        FOREIGN KEY (cardId) REFERENCES cards(id) ON DELETE SET NULL
      );
    `);
  }
}
