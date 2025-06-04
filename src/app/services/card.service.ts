import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Subject } from 'rxjs';

import { CardDTO } from '../models/card.dto';
import { StorageService } from './storage.service';
import { TransactionService } from './transaction.service';

const STORAGE_KEY = 'cards';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private _cardsChanged = new Subject<void>();
  cardsChanged$ = this._cardsChanged.asObservable();

  constructor(
    private storageService: StorageService,
    private transactionService: TransactionService
  ) {}

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
    let cards: CardDTO[] = [];
    if (this.storageService.isRunningOnWeb()) {
      const raw = localStorage.getItem(STORAGE_KEY);
      cards = raw ? JSON.parse(raw) : [];
    } else {
      const db = await this.storageService.getDB();
      await this.ensureTable(db);

      const result = await db.query(
        `SELECT id, title, type, cardLimit, dueDate, brand, lastDigits
         FROM cards ORDER BY id DESC
         `
      );
      const rows = result.values ?? [];
      cards = rows.map((row) => ({
        id: row.id,
        title: row.title,
        type: row.type,
        cardLimit: row.cardLimit,
        dueDate: row.dueDate,
        brand: row.brand,
        lastDigits: row.lastDigits,
      }));
    }

    const allTransactions = await this.transactionService.listTransactions();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return cards.map((card) => {
      if (card.type === 'credit_card' && card.id) {
        const usage = allTransactions
          .filter(
            (t) =>
              t.cardId === card.id &&
              t.type === 'withdrawal' &&
              new Date(t.date).getMonth() === currentMonth &&
              new Date(t.date).getFullYear() === currentYear
          )
          .reduce((sum, t) => sum + (t.price || 0), 0);

        card.cardUsage = usage;
      } else {
        card.cardUsage = 0;
      }
      return card;
    });
  }

  async createCard(data: CardDTO): Promise<number> {
    let newId: number;
    if (this.storageService.isRunningOnWeb()) {
      const list = await this.listCards();
      newId = list.length > 0 ? Math.max(...list.map((c) => c.id ?? 0)) + 1 : 1;
      const newCard = { ...data, id: newId };
      list.push(newCard);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } else {
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
        newId = result.changes?.lastId ?? -1;
      } catch (error) {
        console.error('CardService - Erro ao criar cartão:', error);
        throw error;
      }
    }
    this._cardsChanged.next();
    return newId;
  }

  async updateCard(data: CardDTO): Promise<number> {
    if (!data.id)
      throw new Error('ID do cartão é obrigatório para atualização.');

    let changesCount: number;
    if (this.storageService.isRunningOnWeb()) {
      const list = await this.listCards();
      const index = list.findIndex((c) => c.id === data.id);
      if (index === -1) changesCount = 0;
      else {
        list[index] = { ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        changesCount = 1;
      }
    } else {
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

      try {
        const result = await db.run(query, values);
        changesCount = result.changes?.changes ?? 0;
      } catch (error) {
        console.error('CardService - Erro ao atualizar cartão:', error);
        throw error;
      }
    }
    if (changesCount > 0) {
      this._cardsChanged.next();
    }
    return changesCount;
  }

  async increaseCardLimitUsage(cardId: number, amount: number): Promise<void> {
    const cards = await this.listCards();
    const cardToUpdate = cards.find((card) => card.id === cardId);

    if (cardToUpdate && cardToUpdate.type === 'credit_card') {
      cardToUpdate.cardUsage = (cardToUpdate.cardUsage || 0) - amount;

      if (cardToUpdate.cardUsage < 0) {
        cardToUpdate.cardUsage = 0;
      }

      this._cardsChanged.next();
    }
  }

  async deleteCard(id: number): Promise<number> {
    let changesCount: number;
    if (this.storageService.isRunningOnWeb()) {
      const list = await this.listCards();
      const newList = list.filter((c) => c.id !== id);
      const deleted = list.length !== newList.length;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      changesCount = deleted ? 1 : 0;
    } else {
      const db = await this.storageService.getDB();
      await this.ensureTable(db);

      const query = `DELETE FROM cards WHERE id = ?;`;

      try {
        const result = await db.run(query, [id]);
        changesCount = result.changes?.changes ?? 0;
      } catch (error) {
        console.error('Erro ao deletar cartão:', error);
        throw error;
      }
    }
    if (changesCount > 0) {
      this._cardsChanged.next();
    }
    return changesCount;
  }
}
