import { TestBed } from '@angular/core/testing';
import {
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let sqliteConnectionSpy: jasmine.SpyObj<SQLiteConnection>;
  let sqliteDBConnectionMock: jasmine.SpyObj<SQLiteDBConnection>;
  let getPlatformSpy: jasmine.Spy;

  beforeEach(() => {
    sqliteDBConnectionMock = jasmine.createSpyObj('SQLiteDBConnection', [
      'open',
    ]);
    sqliteConnectionSpy = jasmine.createSpyObj('SQLiteConnection', [
      'createConnection',
    ]);
    sqliteConnectionSpy.createConnection.and.returnValue(
      Promise.resolve(sqliteDBConnectionMock)
    );

    getPlatformSpy = spyOn(Capacitor, 'getPlatform').and.returnValue('android');

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: SQLiteConnection, useValue: sqliteConnectionSpy },
      ],
    });

    service = TestBed.inject(StorageService);
    (service as any).sqlite = sqliteConnectionSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect if running on web', () => {
    getPlatformSpy.and.returnValue('web');
    const webService = new StorageService();
    expect(webService.isRunningOnWeb()).toBeTrue();
  });

  it('should initialize database if not on web', async () => {
    getPlatformSpy.and.returnValue('android');
    await service.init();

    expect(sqliteConnectionSpy.createConnection).toHaveBeenCalledWith(
      'financeDB',
      false,
      'no-encryption',
      1,
      false
    );
    expect(sqliteDBConnectionMock.open).toHaveBeenCalled();
  });

  it('should return the SQLiteDBConnection instance', async () => {
    getPlatformSpy.and.returnValue('android');
    await service.init();
    const db = await service.getDB();
    expect(db).toBe(sqliteDBConnectionMock);
  });

  it('should throw error if db connection fails', async () => {
    const failingService = new StorageService();
    (failingService as any).db = null;
    spyOn(failingService as any, 'init').and.resolveTo(undefined);

    try {
      await failingService.getDB();
      fail('Esperado lançar erro');
    } catch (error: any) {
      expect(error.message).toBe('Falha ao conectar ao banco de dados.');
    }
  });
});
