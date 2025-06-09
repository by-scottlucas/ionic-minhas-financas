import { TestBed } from '@angular/core/testing';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { StorageService } from './storage.service';
import {
  CREATE_TRANSACTION_MOCK,
  LIST_TRANSACTIONS_MOCK,
  UPDATE_TRANSACTION_MOCK,
} from './testing/transaction-mocks';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
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
        TransactionService,
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });

    service = TestBed.inject(TransactionService);
  });

  describe('listTransactions', () => {
    it('should return transactions from localStorage on web', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(true);
      const mockData = LIST_TRANSACTIONS_MOCK;
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockData));

      const result = await service.listTransactions();
      expect(result.length).toBe(4);
      expect(result[0].title).toBe('Compra Mercado');
    });

    it('should return transactions from SQLite on device', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(false);
      storageServiceSpy.getDB.and.resolveTo(dbMock);
      dbMock.query.and.resolveTo({
        values: LIST_TRANSACTIONS_MOCK,
      });

      const result = await service.listTransactions();
      expect(result.length).toBe(4);
      expect(result[0].title).toBe('Compra Mercado');
    });
  });

  describe('createTransaction', () => {
    it('should create transaction on web', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(true);
      spyOn(service, 'listTransactions').and.resolveTo([]);
      spyOn(localStorage, 'setItem');

      const id = await service.createTransaction(CREATE_TRANSACTION_MOCK);

      expect(id).toBe(1);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should create transaction on device', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(false);
      storageServiceSpy.getDB.and.resolveTo(dbMock);
      dbMock.run.and.resolveTo({ changes: { lastId: 2 } });

      const id = await service.createTransaction(CREATE_TRANSACTION_MOCK);

      expect(id).toBe(2);
    });
  });

  describe('updateTransaction', () => {
    it('should update transaction on web', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(true);
      const spyList = spyOn(service, 'listTransactions').and.resolveTo(
        LIST_TRANSACTIONS_MOCK
      );
      spyOn(localStorage, 'setItem');

      const result = await service.updateTransaction(UPDATE_TRANSACTION_MOCK);

      expect(result).toBe(1);
      expect(spyList).toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should update transaction on device', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(false);
      storageServiceSpy.getDB.and.resolveTo(dbMock);
      dbMock.run.and.resolveTo({ changes: { changes: 1 } });

      const result = await service.updateTransaction(UPDATE_TRANSACTION_MOCK);

      expect(result).toBe(1);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete transaction on web', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(true);
      spyOn(service, 'listTransactions').and.resolveTo(LIST_TRANSACTIONS_MOCK);
      spyOn(localStorage, 'setItem');

      const result = await service.deleteTransaction(1);
      expect(result).toBe(1);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should delete transaction on device', async () => {
      storageServiceSpy.isRunningOnWeb.and.returnValue(false);
      storageServiceSpy.getDB.and.resolveTo(dbMock);
      dbMock.run.and.resolveTo({ changes: { changes: 1 } });

      const result = await service.deleteTransaction(2);
      expect(result).toBe(1);
    });
  });
});
