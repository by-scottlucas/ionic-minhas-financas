import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { CardDTO } from '../models/card.dto';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'cards';

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
        cardLimit REAL,
        dueDate INTEGER,
        brand TEXT NOT NULL,
        lastDigits TEXT NOT NULL
      );
    `;
    await db.execute(createTableQuery);
  }

  async listCards(): Promise<CardDTO[]> {
    if (this.storageService.isRunningOnWeb()) {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: CardDTO[] = raw ? JSON.parse(raw) : [];
      return parsed;
    }

    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const result = await db.query(
      'SELECT id, title, type, cardLimit, dueDate, brand, lastDigits FROM cards ORDER BY id DESC'
    );
    const rows = result.values ?? [];

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      cardLimit: row.cardLimit,
      dueDate: row.dueDate,
      brand: row.brand,
      lastDigits: row.lastDigits,
    }));
  }

  async createCard(data: CardDTO): Promise<number> {
    if (this.storageService.isRunningOnWeb()) {
      const list = await this.listCards();
      const newId =
        list.length > 0 ? Math.max(...list.map((c) => c.id ?? 0)) + 1 : 1;
      const newCard = { ...data, id: newId };
      list.push(newCard);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return newId;
    }

    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `
      INSERT INTO cards (title, type, cardLimit, dueDate, brand, lastDigits)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const values = [
      data.title,
      data.type,
      data.cardLimit,
      data.dueDate,
      data.brand,
      data.lastDigits,
    ];

    console.log(
      'CardService - createCard - Valores a serem inseridos:',
      values
    );

    try {
      const result = await db.run(query, values);
      return result.changes?.lastId ?? -1;
    } catch (error) {
      console.error('CardService - Erro ao criar cartão:', error);
      throw error;
    }
  }

  async updateCard(data: CardDTO): Promise<number> {
    if (!data.id)
      throw new Error('ID do cartão é obrigatório para atualização.');

    if (this.storageService.isRunningOnWeb()) {
      const list = await this.listCards();
      const index = list.findIndex((c) => c.id === data.id);
      if (index === -1) return 0;
      list[index] = { ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return 1;
    }

    const db = await this.storageService.getDB();
    await this.ensureTable(db);

    const query = `
      UPDATE cards
      SET title = ?, type = ?, cardLimit = ?, dueDate = ?, brand = ?, lastDigits = ?
      WHERE id = ?;
    `;

    const values = [
      data.title,
      data.type,
      data.cardLimit,
      data.dueDate,
      data.brand,
      data.lastDigits,
      data.id,
    ];

    console.log(
      'CardService - updateCard - Valores a serem atualizados:',
      values
    );

    try {
      const result = await db.run(query, values);
      return result.changes?.changes ?? 0;
    } catch (error) {
      console.error('CardService - Erro ao atualizar cartão:', error);
      throw error;
    }
  }

  async deleteCard(id: number): Promise<number> {
    if (this.storageService.isRunningOnWeb()) {
      const list = await this.listCards();
      const newList = list.filter((c) => c.id !== id);
      const deleted = list.length !== newList.length;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      return deleted ? 1 : 0;
    }

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
