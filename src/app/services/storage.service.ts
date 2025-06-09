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
export class StorageService {
  private sqlite!: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'financeDB';

  constructor() {
    if (Capacitor.getPlatform() !== 'web') {
      this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }
  }

  get isWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

  async init(): Promise<void> {
    if (this.db || this.isWeb) return;

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

  isRunningOnWeb(): boolean {
    return this.isWeb;
  }
}
