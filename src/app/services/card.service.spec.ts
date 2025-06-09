import { TestBed } from '@angular/core/testing';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { CardService } from './card.service';
import { StorageService } from './storage.service';
import {
  CREATE_CARD_MOCK,
  LIST_CARDS_MOCK,
  UPDATE_CARD_MOCK,
} from './testing/card-mocks';

describe('CardService', () => {
  let service: CardService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let dbMock: jasmine.SpyObj<SQLiteDBConnection>;

  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'isRunningOnWeb',
      'getDB',
    ]);

    dbMock = jasmine.createSpyObj('SQLiteDBConnection', [
      'execute',
      'query',
      'run',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CardService,
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });

    service = TestBed.inject(CardService);
  });

  describe('listCards', () => {
    it('should return cards from localStorage on web', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(true);
      const mockData = LIST_CARDS_MOCK;
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockData));

      const result = await service.listCards();

      expect(result.length).toBe(3);
      expect(result[0].title).toBe('Cartão Nubank');
    });

    it('should return cards from SQLite on device', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(false);
      storageServiceSpy.getDB.and.resolveTo(dbMock);
      dbMock.query.and.resolveTo({
        values: LIST_CARDS_MOCK,
      });

      const result = await service.listCards();

      expect(result.length).toBe(3);
      expect(result[0].title).toBe('Cartão Nubank');
    });
  });

  describe('createCard', () => {
    it('should create card on web', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(true);
      spyOn(service, 'listCards').and.resolveTo([]);
      spyOn(localStorage, 'setItem');

      const id = await service.createCard(CREATE_CARD_MOCK);

      expect(id).toBe(1);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should create card on device', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(false);
      storageServiceSpy.getDB.and.resolveTo(dbMock);
      dbMock.run.and.resolveTo({ changes: { lastId: 2 } });

      const id = await service.createCard(CREATE_CARD_MOCK);

      expect(id).toBe(2);
    });
  });

  describe('updateCard', () => {
    it('should update card on web', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(true);
      const spyList = spyOn(service, 'listCards').and.resolveTo(
        LIST_CARDS_MOCK
      );
      spyOn(localStorage, 'setItem');

      const result = await service.updateCard(UPDATE_CARD_MOCK);

      expect(result).toBe(1);
      expect(spyList).toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should update card on device', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(false);
      storageServiceSpy.getDB.and.resolveTo(dbMock);
      dbMock.run.and.resolveTo({ changes: { changes: 1 } });

      const result = await service.updateCard(UPDATE_CARD_MOCK);

      expect(result).toBe(1);
    });
  });

  describe('deleteCard', () => {
    it('should delete card on web', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(true);
      spyOn(service, 'listCards').and.resolveTo(LIST_CARDS_MOCK);
      spyOn(localStorage, 'setItem');

      const result = await service.deleteCard(1);

      expect(result).toBe(1);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should delete card on device', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(false);
      storageServiceSpy.getDB.and.resolveTo(dbMock);
      dbMock.run.and.resolveTo({ changes: { changes: 1 } });

      const result = await service.deleteCard(2);

      expect(result).toBe(1);
    });
  });
});
