import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlertController,
  IonicModule,
  IonItemSliding,
  ModalController,
} from '@ionic/angular';
import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { TransactionCategoryEnum } from 'src/app/models/enums/transaction/transaction-category.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import {
  DELETE_TRANSACTION_MOCK,
  UPDATE_TRANSACTION_MOCK,
} from 'src/app/services/testing/transaction-mocks';
import { TransactionService } from 'src/app/services/transaction.service';

import { TransactionListComponent } from './transaction-list.component';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let modalCtrl: jasmine.SpyObj<ModalController>;
  let alertCtrl: jasmine.SpyObj<AlertController>;
  let transactionService: jasmine.SpyObj<TransactionService>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('ModalController', ['create']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', [
      'deleteTransaction',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TransactionListComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalSpy },
        { provide: AlertController, useValue: alertSpy },
        { provide: TransactionService, useValue: transactionServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    modalCtrl = TestBed.inject(
      ModalController
    ) as jasmine.SpyObj<ModalController>;
    alertCtrl = TestBed.inject(
      AlertController
    ) as jasmine.SpyObj<AlertController>;
    transactionService = TestBed.inject(
      TransactionService
    ) as jasmine.SpyObj<TransactionService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('getCategoryLabel', () => {
    it('should return the correct label for known category', () => {
      expect(component.getCategoryLabel(TransactionCategoryEnum.Food)).toBe(
        'Alimentação'
      );
    });

    it('should return the original value for unknown category', () => {
      expect(component.getCategoryLabel(TransactionCategoryEnum.Others)).toBe(
        'Outros'
      );
    });
  });

  describe('getPaymentMethodLabel', () => {
    it('should return the correct label for known payment method', () => {
      expect(
        component.getPaymentMethodLabel(PaymentMethodEnum.CREDIT_CARD)
      ).toBe('Cartão de Crédito');
    });

    it('should return the original value for unknown payment method', () => {
      expect(component.getPaymentMethodLabel('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('onEditTransaction', () => {
    it('should open modal, emit updated if updated, and close sliding item', async () => {
      const slidingItem = jasmine.createSpyObj<IonItemSliding>(
        'IonItemSliding',
        ['close']
      );
      const transaction: TransactionDTO = UPDATE_TRANSACTION_MOCK;

      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onWillDismiss',
      ]);
      modalSpy.onWillDismiss.and.returnValue(
        Promise.resolve({ data: { updated: true } })
      );

      modalCtrl.create.and.returnValue(Promise.resolve(modalSpy));

      spyOn(component.updated, 'emit');

      await component.onEditTransaction(transaction, slidingItem);

      expect(modalCtrl.create).toHaveBeenCalled();
      expect(modalSpy.present).toHaveBeenCalled();
      expect(modalSpy.onWillDismiss).toHaveBeenCalled();
      expect(component.updated.emit).toHaveBeenCalled();
      expect(slidingItem.close).toHaveBeenCalled();
    });

    it('should handle error if modal creation fails', async () => {
      modalCtrl.create.and.rejectWith('Modal creation error');

      try {
        await component.onEditTransaction(
          UPDATE_TRANSACTION_MOCK,
          jasmine.createSpyObj('IonItemSliding', ['close'])
        );
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBe('Modal creation error');
      }
    });

    it('should not emit updated if result.updated is falsy', async () => {
      const slidingItem = jasmine.createSpyObj<IonItemSliding>(
        'IonItemSliding',
        ['close']
      );
      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onWillDismiss',
      ]);
      modalSpy.onWillDismiss.and.returnValue(
        Promise.resolve({ data: { updated: false } })
      );
      modalCtrl.create.and.returnValue(Promise.resolve(modalSpy));

      spyOn(component.updated, 'emit');

      await component.onEditTransaction(UPDATE_TRANSACTION_MOCK, slidingItem);

      expect(component.updated.emit).not.toHaveBeenCalled();
      expect(slidingItem.close).toHaveBeenCalled();
    });
  });

  describe('onDeleteTransaction', () => {
    it('should show alert and delete transaction if confirmed', async () => {
      const transaction: TransactionDTO = DELETE_TRANSACTION_MOCK;

      const handler = jasmine.createSpy('handler');
      const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);

      alertCtrl.create.and.returnValue(
        Promise.resolve({
          ...alertSpy,
          buttons: [
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Excluir',
              role: 'destructive',
              handler: handler.and.callFake(async () => {
                await transactionService.deleteTransaction(transaction.id!);
                component.updated.emit();
              }),
            },
          ],
        })
      );

      spyOn(component.updated, 'emit');

      await component.onDeleteTransaction(transaction);
      expect(alertCtrl.create).toHaveBeenCalled();
      expect(alertSpy.present).toHaveBeenCalled();

      const createdAlert = await alertCtrl.create.calls.mostRecent()
        .returnValue;
      const deleteButton = (createdAlert.buttons as any[]).find(
        (btn: any) => typeof btn !== 'string' && btn.text === 'Excluir'
      );

      await deleteButton?.handler?.();

      expect(transactionService.deleteTransaction).toHaveBeenCalledWith(
        transaction.id!
      );
      expect(component.updated.emit).toHaveBeenCalled();
    });

    it('should not delete transaction if user cancels the alert', async () => {
      const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
      alertCtrl.create.and.returnValue(
        Promise.resolve({
          ...alertSpy,
          buttons: [
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Excluir',
              role: 'destructive',
              handler: () => {},
            },
          ],
        })
      );

      spyOn(component.updated, 'emit');
      await component.onDeleteTransaction(DELETE_TRANSACTION_MOCK);

      const alert = await alertCtrl.create.calls.mostRecent().returnValue;
      const cancelButton = (alert.buttons as any[]).find(
        (btn: any) => typeof btn !== 'string' && btn.text === 'Cancelar'
      );

      if (cancelButton.handler) cancelButton.handler();

      expect(transactionService.deleteTransaction).not.toHaveBeenCalled();
      expect(component.updated.emit).not.toHaveBeenCalled();
    });
  });
});
