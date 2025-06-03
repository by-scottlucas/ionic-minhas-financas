import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'financeDB';

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await this.sqlite.createConnection(
      this.dbName,
      false,
      'no-encryption',
      1,
      false
    );
    await this.db.open();
  }

  async getDB(): Promise<SQLiteDBConnection> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) throw new Error('Falha ao conectar ao banco de dados.');
    return this.db;
  }
}
