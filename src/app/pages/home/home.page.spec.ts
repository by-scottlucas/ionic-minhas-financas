import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { FilterBarService } from 'src/app/components/filter-bar/filter-bar.service';
import { LIST_TRANSACTIONS_MOCK } from 'src/app/services/testing/transaction-mocks';
import { TransactionService } from 'src/app/services/transaction.service';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let filterBarServiceSpy: jasmine.SpyObj<FilterBarService>;

  const transactionMock = LIST_TRANSACTIONS_MOCK;

  beforeEach(async () => {
    const transactionSubject = new Subject<void>();

    const transactionServiceMock = jasmine.createSpyObj(
      'TransactionService',
      ['listTransactions'],
      {
        transactionsChanged$: transactionSubject.asObservable(),
      }
    );

    const modalControllerMock = jasmine.createSpyObj('ModalController', [
      'create',
    ]);
    const filterBarServiceMock = jasmine.createSpyObj('FilterBarService', [
      'filterTransactions',
    ]);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: TransactionService, useValue: transactionServiceMock },
        { provide: ModalController, useValue: modalControllerMock },
        { provide: FilterBarService, useValue: filterBarServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    transactionServiceSpy = TestBed.inject(
      TransactionService
    ) as jasmine.SpyObj<TransactionService>;
    modalControllerSpy = TestBed.inject(
      ModalController
    ) as jasmine.SpyObj<ModalController>;
    filterBarServiceSpy = TestBed.inject(
      FilterBarService
    ) as jasmine.SpyObj<FilterBarService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on init', fakeAsync(async () => {
    transactionServiceSpy.listTransactions.and.resolveTo(transactionMock);
    filterBarServiceSpy.filterTransactions.and.returnValue(transactionMock);

    component.ngOnInit();
    tick(1000);
    flush();

    expect(component.isLoading).toBeFalse();
    expect(component.transactionsData.length).toBe(4);
    expect(transactionServiceSpy.listTransactions).toHaveBeenCalled();
  }));

  it('should calculate correct values for cards', () => {
    component['allTransactions'] = LIST_TRANSACTIONS_MOCK;
    component['calculateCardValues']();

    expect(component.firstValue).toBe(5000);
    expect(component.secondValue).toBe(120);
    expect(component.balanceValue).toBe(4880);
    expect(component.balanceIcon).toBe('trending-up-outline');
  });

  it('should call modal on add transaction', fakeAsync(async () => {
    const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
    modalControllerSpy.create.and.resolveTo(modalSpy);

    component.onAddTransaction();
    tick(100);
    flush();

    expect(modalControllerSpy.create).toHaveBeenCalled();
    expect(modalSpy.present).toHaveBeenCalled();
  }));

  it('should filter transactions when search term changes', () => {
    filterBarServiceSpy.filterTransactions.and.returnValue([]);
    component['allTransactions'] = LIST_TRANSACTIONS_MOCK;

    component.onSearch('Salário');

    expect(component.searchTerm).toBe('Salário');
    expect(filterBarServiceSpy.filterTransactions).toHaveBeenCalledWith(
      LIST_TRANSACTIONS_MOCK,
      'Salário',
      null!
    );
  });

  it('should apply filters when advanced filters are applied', () => {
    const filters = { category: 'Food' };
    component['allTransactions'] = LIST_TRANSACTIONS_MOCK;
    filterBarServiceSpy.filterTransactions.and.returnValue([]);

    component.onFilterApplied(filters);

    expect(component.advancedFilters).toBe(filters);
    expect(filterBarServiceSpy.filterTransactions).toHaveBeenCalled();
  });

  it('should handle refresh', fakeAsync(() => {
    spyOn(component, 'loadTransactions').and.callThrough();
    transactionServiceSpy.listTransactions.and.resolveTo(transactionMock);
    filterBarServiceSpy.filterTransactions.and.returnValue(transactionMock);

    const eventMock = {
      target: {
        complete: jasmine.createSpy('complete'),
      },
    } as any;

    component.handleRefresh(eventMock);
    tick(1000);
    flush();

    expect(component.loadTransactions).toHaveBeenCalled();
    expect(eventMock.target.complete).toHaveBeenCalled();
  }));

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    component['transactionsSubscription'] = {
      unsubscribe: unsubscribeSpy,
    } as any;

    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
