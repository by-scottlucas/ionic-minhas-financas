import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { CardDTO } from 'src/app/models/card.dto';
import { CardTypeEnum } from 'src/app/models/enums/card/card-type.enum';
import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { CardService } from 'src/app/services/card.service';
import { LIST_CARDS_MOCK } from 'src/app/services/testing/card-mocks';
import { CREATE_TRANSACTION_MOCK } from 'src/app/services/testing/transaction-mocks';
import { TransactionService } from 'src/app/services/transaction.service';

import {
  CREATE_TRANSACTION_CREDIT_CARD_MOCK,
  EDIT_TRANSACTION_MOCK,
  NEW_TRANSACTION_MOCK,
} from './testing/transaction-form.mocks';
import { TransactionFormComponent } from './transaction-form.component';

describe('TransactionFormComponent', () => {
  let component: TransactionFormComponent;
  let fixture: ComponentFixture<TransactionFormComponent>;
  let cardServiceSpy: jasmine.SpyObj<CardService>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  const mockCards: CardDTO[] = LIST_CARDS_MOCK;

  beforeEach(async () => {
    cardServiceSpy = jasmine.createSpyObj('CardService', [
      'listCards',
      'increaseCardLimitUsage',
    ]);
    transactionServiceSpy = jasmine.createSpyObj('TransactionService', [
      'createTransaction',
      'updateTransaction',
    ]);
    alertCtrlSpy = jasmine.createSpyObj('AlertController', ['create']);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [TransactionFormComponent],
      imports: [ReactiveFormsModule, IonicModule.forRoot()],
      providers: [
        { provide: CardService, useValue: cardServiceSpy },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: AlertController, useValue: alertCtrlSpy },
        { provide: ModalController, useValue: modalCtrlSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFormComponent);
    component = fixture.componentInstance;

    cardServiceSpy.listCards.and.returnValue(Promise.resolve(mockCards));
    alertCtrlSpy.create.and.returnValue(
      Promise.resolve({ present: () => Promise.resolve() } as any)
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should complete the form when receiving a transaction', async () => {
    component.transaction = CREATE_TRANSACTION_MOCK;
    await component.ngOnInit();
    expect(component.form.value.title).toEqual('Compra Mercado');
  });

  it('should list only credit cards', async () => {
    await component.listCreditCards();
    expect(component.creditCards.length).toBe(3);
    expect(component.creditCards[0].type).toBe(CardTypeEnum.CREDIT_CARD);
  });

  it('should show card selector if payment method is credit card', () => {
    component.form.get('paymentMethod')?.setValue(CardTypeEnum.CREDIT_CARD);
    component.onPaymentMethodChange(component.form.get('paymentMethod')?.value);
    expect(component.showCreditCardSelect).toBeTrue();
  });

  it('should hide card selector if other payment method is selected', () => {
    component.form.get('paymentMethod')?.setValue(PaymentMethodEnum.PIX);
    expect(component.showCreditCardSelect).toBeFalse();
  });

  it('should prevent submission if form is invalid', fakeAsync(async () => {
    spyOn(component as any, 'presentAlert');
    await component.onSubmit();
    expect((component as any).presentAlert).toHaveBeenCalledWith(
      'Formulário Inválido',
      'Por favor, preencha todos os campos obrigatórios.'
    );
  }));

  it('should show alert if insufficient limit', fakeAsync(async () => {
    component.form.patchValue({
      CREATE_TRANSACTION_CREDIT_CARD_MOCK,
    });
    component.creditCards = mockCards;

    await component.onSubmit();
    expect(alertCtrlSpy.create).toHaveBeenCalled();
  }));

  it('should create a new transaction if there is no ID', fakeAsync(async () => {
    component.form.setValue({ ...NEW_TRANSACTION_MOCK });
    await component.onSubmit();
    expect(transactionServiceSpy.createTransaction).toHaveBeenCalled();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith({ updated: true });
  }));

  it('should update transaction if the ID exists', fakeAsync(async () => {
    component.transaction = { id: '123' } as any;
    component.form.setValue({ ...EDIT_TRANSACTION_MOCK });
    await component.onSubmit();
    expect(transactionServiceSpy.updateTransaction).toHaveBeenCalled();
  }));

  it('should block negative input', () => {
    const event = new KeyboardEvent('keydown', { key: '-' });
    spyOn(event, 'preventDefault');
    component.blockNegativeInput(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should format date correctly', () => {
    (component as any).updateFormattedDate('2024-08-09');
    expect(component.formattedDate).toBe('09/08/2024');
  });

  it('should show validation error messages', () => {
    component.form.get('title')?.markAsTouched();
    component.form.get('title')?.setErrors({ required: true });
    expect(component.getErrorMessage('title')).toBe(
      'Este campo é obrigatório.'
    );
  });

  it('should open date modal', () => {
    component.openDatepicker();
    expect(component.isDateModalOpen).toBeTrue();
  });

  it('should apply new date to form when selected', () => {
    component.onDateChange({ detail: { value: '2024-08-10' } });
    expect(component.selectedDate).toBe('2024-08-10');
    expect(component.form.get('date')?.value).toBe('2024-08-10');
  });

  it('should close the modal when calling dismiss', () => {
    component.dismiss();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalled();
  });
});
