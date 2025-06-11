import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  ActionSheetController,
  AlertController,
  IonicModule,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Subject } from 'rxjs';
import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { CardService } from 'src/app/services/card.service';
import { TransactionService } from 'src/app/services/transaction.service';

import { CardsCarouselComponent } from './cards-carousel.component';

describe('CardsCarouselComponent', () => {
  let component: CardsCarouselComponent;
  let fixture: ComponentFixture<CardsCarouselComponent>;
  let cardServiceSpy: jasmine.SpyObj<CardService>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;
  let loadingCtrlSpy: jasmine.SpyObj<LoadingController>;
  let actionSheetCtrlSpy: jasmine.SpyObj<ActionSheetController>;
  let cardsChanged$: Subject<void>;
  let transactionsChanged$: Subject<void>;

  beforeEach(async () => {
    cardsChanged$ = new Subject<void>();
    transactionsChanged$ = new Subject<void>();

    const cardServiceMock = jasmine.createSpyObj(
      'CardService',
      ['listCards', 'deleteCard'],
      {
        cardsChanged$: cardsChanged$.asObservable(),
      }
    );

    const transactionServiceMock = jasmine.createSpyObj(
      'TransactionService',
      [],
      {
        transactionsChanged$: transactionsChanged$.asObservable(),
      }
    );

    const modalCtrlMock = jasmine.createSpyObj('ModalController', ['create']);
    const alertCtrlMock = jasmine.createSpyObj('AlertController', ['create']);
    const loadingCtrlMock = jasmine.createSpyObj('LoadingController', [
      'create',
    ]);
    const actionSheetCtrlMock = jasmine.createSpyObj('ActionSheetController', [
      'create',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CardsCarouselComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: CardService, useValue: cardServiceMock },
        { provide: TransactionService, useValue: transactionServiceMock },
        { provide: ModalController, useValue: modalCtrlMock },
        { provide: AlertController, useValue: alertCtrlMock },
        { provide: LoadingController, useValue: loadingCtrlMock },
        { provide: ActionSheetController, useValue: actionSheetCtrlMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsCarouselComponent);
    component = fixture.componentInstance;

    cardServiceSpy = TestBed.inject(CardService) as jasmine.SpyObj<CardService>;
    transactionServiceSpy = TestBed.inject(
      TransactionService
    ) as jasmine.SpyObj<TransactionService>;
    modalCtrlSpy = TestBed.inject(
      ModalController
    ) as jasmine.SpyObj<ModalController>;
    alertCtrlSpy = TestBed.inject(
      AlertController
    ) as jasmine.SpyObj<AlertController>;
    loadingCtrlSpy = TestBed.inject(
      LoadingController
    ) as jasmine.SpyObj<LoadingController>;
    actionSheetCtrlSpy = TestBed.inject(
      ActionSheetController
    ) as jasmine.SpyObj<ActionSheetController>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cards on init and on change events', fakeAsync(async () => {
    cardServiceSpy.listCards.and.returnValue(Promise.resolve([]));

    component.ngOnInit();
    tick(500);
    cardsChanged$.next();
    tick(500);
    transactionsChanged$.next();
    tick(500);

    expect(cardServiceSpy.listCards).toHaveBeenCalledTimes(3);
  }));

  it('should handle error when loading cards', async () => {
    cardServiceSpy.listCards.and.returnValue(Promise.reject('error'));
    spyOn(console, 'error');

    await component.loadCards();

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao carregar cartões:',
      'error'
    );
  });

  it('should return brand color or default', () => {
    expect(component.getBrandColor('visa')).toBe('#1C80F0');
    expect(component.getBrandColor('unknown')).toBe('#6b7280');
  });

  it('should return correct usage percent', () => {
    expect(
      component.getUsagePercent({
        type: PaymentMethodEnum.CREDIT_CARD,
        cardLimit: 1000,
        cardUsage: 500,
      } as any)
    ).toBe(50);
    expect(
      component.getUsagePercent({
        type: PaymentMethodEnum.CREDIT_CARD,
        cardLimit: 0,
      } as any)
    ).toBe(0);
  });

  it('should return available limit', () => {
    expect(
      component.getAvailableLimit({
        type: PaymentMethodEnum.CREDIT_CARD,
        cardLimit: 1000,
        cardUsage: 200,
      } as any)
    ).toBe(800);
  });

  it('should format currency', () => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    expect(component.formatCurrency(1234.56)).toBe(formatter.format(1234.56));
    expect(component.formatCurrency(null)).toBe(formatter.format(0));
  });

  it('should present card actions and handle edit/delete/cancel', fakeAsync(async () => {
    const card = { id: '1', title: 'Card Test' } as any;

    const actionSheet = {
      present: jasmine.createSpy('present'),
    };
    actionSheetCtrlSpy.create.and.returnValue(
      Promise.resolve(actionSheet as any)
    );

    component.presentCardActions(card);
    tick();

    expect(actionSheetCtrlSpy.create).toHaveBeenCalled();
    expect(actionSheet.present).toHaveBeenCalled();
  }));

  it('should delete card when confirmed', fakeAsync(() => {
    const card = { id: 1 } as any;

    const alert = {
      present: jasmine.createSpy('present'),
      onDidDismiss: jasmine
        .createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ role: 'destructive' })),
    };

    const loading = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss'),
    };

    alertCtrlSpy.create.and.returnValue(Promise.resolve(alert as any));
    loadingCtrlSpy.create.and.returnValue(Promise.resolve(loading as any));
    cardServiceSpy.deleteCard.and.returnValue(Promise.resolve(1));
    spyOn(component, 'loadCards');

    component.deleteCard(card);
    tick();
    tick();
    flushMicrotasks();

    expect(alertCtrlSpy.create).toHaveBeenCalled();
    expect(loadingCtrlSpy.create).toHaveBeenCalled();
    expect(cardServiceSpy.deleteCard).toHaveBeenCalledWith(1);
    expect(component.loadCards).toHaveBeenCalled();
    expect(loading.dismiss).toHaveBeenCalled();
  }));

  it('should show error alert when card delete fails', fakeAsync(async () => {
    const card = { id: '1' } as any;
    const alert = {
      present: jasmine.createSpy('present'),
      onDidDismiss: () => Promise.resolve({ role: 'destructive' }),
    };
    const errorAlert = { present: jasmine.createSpy('present') };
    const loading = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss'),
    };

    alertCtrlSpy.create.and.returnValue(Promise.resolve(alert as any));
    loadingCtrlSpy.create.and.returnValue(Promise.resolve(loading as any));
    alertCtrlSpy.create
      .withArgs(jasmine.objectContaining({ header: 'Erro' }))
      .and.returnValue(Promise.resolve(errorAlert as any));

    cardServiceSpy.deleteCard.and.returnValue(Promise.reject('delete error'));

    component.deleteCard(card);
    tick();
    tick();
    flush();

    expect(errorAlert.present).toHaveBeenCalled();
    expect(loading.dismiss).toHaveBeenCalled();
  }));
});
