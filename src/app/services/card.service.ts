import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { CardDTO } from '../models/card.dto';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private storageService: StorageService) {}

  private async ensureTable(db: SQLiteDBConnection): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        limit REAL,
        dueDate INTEGER NOT NULL,
        brand TEXT NOT NULL,
        lastDigits TEXT NOT NULL
      );
    `;
    await db.execute(createTableQuery);
  }

  async listCards(): Promise<CardDTO[]> {
    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const result = await db.query('SELECT * FROM cards ORDER BY date DESC');
    const rows = result.values ?? [];

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      limit: row.limit,
      dueDate: row.dueDate,
      brand: row.brand,
      lastDigits: row.lastDigits,
    }));
  }

  async createCard(data: CardDTO): Promise<number> {
    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `
        INSERT INTO cards (title, type, limit, dueDate, brand, lastDigits)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
    const values = [
      data.title,
      data.type,
      data.limit,
      data.dueDate,
      data.brand,
      data.lastDigits,
    ];

    try {
      const result = await db.run(query, values);
      return result.changes?.lastId ?? -1;
    } catch (error) {
      console.error('Erro ao criar cartão:', error);
      throw error;
    }
  }

  async updateCard(data: CardDTO): Promise<number> {
    if (!data.id) {
      throw new Error('ID da transação é obrigatório para atualização.');
    }

    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `
        UPDATE cards
        SET title = ?, type = ?, limit = ?, dueDate = ?, brand = ?, lastDigits = ?
        WHERE id = ?;
      `;

    const values = [
      data.title,
      data.type,
      data.limit,
      data.dueDate,
      data.brand,
      data.lastDigits,
      data.id,
    ];

    try {
      const result = await db.run(query, values);
      return result.changes?.changes ?? 0;
    } catch (error) {
      console.error('Erro ao atualizar cartão:', error);
      throw error;
    }
  }

  async deleteCard(id: number): Promise<number> {
    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `DELETE FROM cards WHERE id = ?;`;

    try {
      const result = await db.run(query, [id]);
      return result.changes?.changes ?? 0;
    } catch (error) {
      console.error('Erro ao deletar cartão:', error);
      throw error;
    }
  }
}
