import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SqliteService } from 'src/app/core/database/sqlite.service';

import { WalletService } from '../../wallet/services/wallet.service';
import { CardDTO } from '../models/card.dto';

const STORAGE_KEY = 'cards';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private _cardsChanged = new Subject<void>();
  cardsChanged$ = this._cardsChanged.asObservable();

  constructor(
    private sqliteService: SqliteService,
    private walletService: WalletService
  ) {}

  async listCards(): Promise<CardDTO[]> {
    let cards: CardDTO[] = [];

    if (this.sqliteService.isWeb()) {
      const raw = localStorage.getItem(STORAGE_KEY);
      cards = raw ? JSON.parse(raw) : [];
    } else {
      const db = await this.sqliteService.getDB();

      const result = await db.query(
        `SELECT id, title, type, cardLimit, dueDate, brand, lastDigits
         FROM cards
         ORDER BY id DESC`
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

    const allTransactions = await this.walletService.listTransactions();
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

        return { ...card, cardUsage: usage };
      }

      return { ...card, cardUsage: 0 };
    });
  }

  async createCard(data: CardDTO): Promise<number> {
    let newId: number;

    if (this.sqliteService.isWeb()) {
      const list = await this.listCards();
      newId = list.length > 0 ? Math.max(...list.map((c) => c.id ?? 0)) + 1 : 1;

      const newCard = { ...data, id: newId };
      list.push(newCard);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } else {
      const db = await this.sqliteService.getDB();

      const query = `
        INSERT INTO cards (title, type, cardLimit, dueDate, brand, lastDigits)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

      const values = [
        data.title,
        data.type,
        data.cardLimit ?? null,
        data.dueDate ?? null,
        data.brand,
        data.lastDigits,
      ];

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
    if (!data.id) {
      throw new Error('ID do cartão é obrigatório para atualização.');
    }

    let changesCount: number;

    if (this.sqliteService.isWeb()) {
      const list = await this.listCards();
      const index = list.findIndex((c) => c.id === data.id);

      if (index === -1) {
        changesCount = 0;
      } else {
        list[index] = { ...data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        changesCount = 1;
      }
    } else {
      const db = await this.sqliteService.getDB();

      const query = `
        UPDATE cards
        SET title = ?, type = ?, cardLimit = ?, dueDate = ?, brand = ?, lastDigits = ?
        WHERE id = ?;
      `;

      const values = [
        data.title,
        data.type,
        data.cardLimit ?? null,
        data.dueDate ?? null,
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

  async deleteCard(id: number): Promise<number> {
    let changesCount: number;

    if (this.sqliteService.isWeb()) {
      const list = await this.listCards();
      const newList = list.filter((c) => c.id !== id);
      const deleted = list.length !== newList.length;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      changesCount = deleted ? 1 : 0;
    } else {
      const db = await this.sqliteService.getDB();

      try {
        const result = await db.run(`DELETE FROM cards WHERE id = ?;`, [id]);

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

  async increaseCardLimitUsage(cardId: number, amount: number): Promise<void> {
    const cards = await this.listCards();
    const cardToUpdate = cards.find((card) => card.id === cardId);

    if (cardToUpdate && cardToUpdate.type === 'credit_card') {
      const updatedUsage = Math.max((cardToUpdate.cardUsage || 0) - amount, 0);

      cardToUpdate.cardUsage = updatedUsage;
      this._cardsChanged.next();
    }
  }
}
