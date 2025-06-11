import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { FilterBarService } from 'src/app/components/filter-bar/filter-bar.service';
import { LIST_TRANSACTIONS_MOCK } from 'src/app/services/testing/transaction-mocks';
import { TransactionService } from 'src/app/services/transaction.service';

import { CardsPage } from './cards.page';

describe('CardsPage', () => {
  let component: CardsPage;
  let fixture: ComponentFixture<CardsPage>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let transactionsChanged$: Subject<void>;
  let filterBarServiceSpy: jasmine.SpyObj<FilterBarService>;

  beforeEach(async () => {
    transactionsChanged$ = new Subject<void>();

    transactionServiceSpy = jasmine.createSpyObj(
      'TransactionService',
      ['listTransactions'],
      {
        transactionsChanged$: transactionsChanged$.asObservable(),
      }
    );

    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [CardsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: FilterBarService, useValue: filterBarServiceSpy },
        { provide: TransactionService, useValue: transactionServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsPage);
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

  it('should load only card transactions on init', fakeAsync(async () => {
    const mockTransactions = LIST_TRANSACTIONS_MOCK;

    transactionServiceSpy.listTransactions.and.resolveTo(mockTransactions);

    component.ngOnInit();
    tick(500);

    expect(transactionServiceSpy.listTransactions).toHaveBeenCalled();
    expect(component.cardTransactions.length).toBe(3);
    expect(component.isLoading).toBeFalse();
  }));

  it('should react to transactionsChanged$ and reload', fakeAsync(() => {
    transactionServiceSpy.listTransactions.and.resolveTo([]);
    component.ngOnInit();
    tick(500);

    transactionServiceSpy.listTransactions.calls.reset();

    transactionsChanged$.next();
    tick(500);

    expect(transactionServiceSpy.listTransactions).toHaveBeenCalledTimes(1);
  }));

  it('should handle refresh', fakeAsync(() => {
    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete'),
      },
    } as any;

    transactionServiceSpy.listTransactions.and.resolveTo([]);
    component.handleRefresh(mockEvent);
    tick(500);

    expect(mockEvent.target.complete).toHaveBeenCalled();
  }));

  it('should unsubscribe on destroy', () => {
    component['transactionsSubscription'] = transactionsChanged$.subscribe();
    const unsubscribeSpy = spyOn(
      component['transactionsSubscription'],
      'unsubscribe'
    );

    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should open modal on add transaction', fakeAsync(() => {
    const presentSpy = jasmine
      .createSpy('present')
      .and.returnValue(Promise.resolve());
    modalControllerSpy.create.and.returnValue(
      Promise.resolve({ present: presentSpy } as any)
    );

    component.onAddTransaction();
    tick();

    expect(modalControllerSpy.create).toHaveBeenCalled();
    expect(presentSpy).toHaveBeenCalled();
  }));
});
