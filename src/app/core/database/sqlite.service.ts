import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private sqlite!: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'financeDB';

  constructor() {
    if (!this.isWeb()) {
      this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }
  }

  isWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

  async init(): Promise<void> {
    if (this.db || this.isWeb()) return;

    this.db = await this.sqlite.createConnection(
      this.dbName,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();
    await this.enableForeignKeys();
  }

  private async enableForeignKeys(): Promise<void> {
    if (!this.db) return;
    await this.db.execute('PRAGMA foreign_keys = ON;');
  }

  async getDB(): Promise<SQLiteDBConnection> {
    if (!this.db) {
      await this.init();
    }

    if (!this.db) {
      throw new Error('Falha ao conectar ao banco de dados.');
    }

    return this.db;
  }
}
