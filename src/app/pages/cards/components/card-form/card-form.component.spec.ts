import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CardBrandEnum } from 'src/app/models/enums/card/card-brand.enum';
import { CardTypeEnum } from 'src/app/models/enums/card/card-type.enum';
import { CardService } from 'src/app/services/card.service';
import {
  CREATE_CARD_MOCK,
  UPDATE_CARD_MOCK,
} from 'src/app/services/testing/card-mocks';

import { CardFormComponent } from './card-form.component';

describe('CardFormComponent', () => {
  let component: CardFormComponent;
  let fixture: ComponentFixture<CardFormComponent>;
  let cardServiceSpy: jasmine.SpyObj<CardService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  let toastSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    cardServiceSpy = jasmine.createSpyObj('CardService', [
      'createCard',
      'updateCard',
    ]);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastSpy));

    await TestBed.configureTestingModule({
      declarations: [CardFormComponent],
      imports: [ReactiveFormsModule, FormsModule, IonicModule.forRoot()],
      providers: [
        { provide: CardService, useValue: cardServiceSpy },
        { provide: ModalController, useValue: modalCtrlSpy },
        { provide: ToastController, useValue: toastCtrlSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFormComponent);
    component = fixture.componentInstance;

    component.item = undefined!;
    component.headerTitle = 'Test Title';

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values when no item input', () => {
    expect(component.form.value.title).toBe('');
    expect(component.form.value.type).toBe('');
    expect(component.form.value.cardLimit).toBeNull();
    expect(component.form.value.dueDate).toBeNull();
    expect(component.form.value.brand).toBe('');
    expect(component.form.value.lastDigits).toBe('');
  });

  it('should patch form values on ngOnInit when item is provided', () => {
    component.item = CREATE_CARD_MOCK;

    component.ngOnInit();

    expect(component.form.value.title).toBe('Cartão Agibank');
    expect(component.form.value.type).toBe(CardTypeEnum.CREDIT_CARD);
    expect(component.form.value.cardLimit).toBe(250);
    expect(component.form.value.dueDate).toBe(4);
    expect(component.form.value.brand).toBe(CardBrandEnum.MASTERCARD);
    expect(component.form.value.lastDigits).toBe(3868);

    expect(component.form.get('cardLimit')?.hasError('required')).toBeFalse();
  });

  it('should update validators on type change to credit card', () => {
    component.onTypeChange({ detail: { value: 'credit_card' } });

    expect(component.form.get('cardLimit')?.validator).toBeTruthy();
    expect(component.form.get('dueDate')?.validator).toBeTruthy();
  });

  it('should clear validators and reset values on type change to debit card', () => {
    component.form.patchValue({
      cardLimit: 500,
      dueDate: 10,
    });
    component.onTypeChange({ detail: { value: 'debit_card' } });

    expect(component.form.get('cardLimit')?.validator).toBeNull();
    expect(component.form.get('dueDate')?.validator).toBeNull();
    expect(component.form.value.cardLimit).toBeNull();
    expect(component.form.value.dueDate).toBeNull();
  });

  it('should block negative input on blockNegativeInput', () => {
    const event = new KeyboardEvent('keydown', { key: '-' });
    spyOn(event, 'preventDefault');

    component.blockNegativeInput(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should block invalid number input keys', () => {
    const event = new KeyboardEvent('keydown', { key: 'e' });
    spyOn(event, 'preventDefault');

    component.blockInvalidNumberInput(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not block control keys in blockInvalidNumberInput', () => {
    const controlKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
    ];

    controlKeys.forEach((key) => {
      const event = new KeyboardEvent('keydown', { key });
      spyOn(event, 'preventDefault');

      component.blockInvalidNumberInput(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  it('should show toast when form is invalid on submit', fakeAsync(async () => {
    component.form.controls['title'].setValue('');
    component.form.controls['type'].setValue('');
    component.form.controls['brand'].setValue('');
    component.form.controls['lastDigits'].setValue('');
    component.form.controls['dueDate'].setValue('');
    component.form.controls['cardLimit'].setValue(null);

    await component.onSubmit();

    expect(toastCtrlSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message:
          'Por favor, preencha todos os campos obrigatórios corretamente.',
        color: 'danger',
      })
    );
    expect(toastSpy.present).toHaveBeenCalled();
  }));

  it('should call createCard and dismiss modal on valid new card submission', fakeAsync(async () => {
    cardServiceSpy.createCard.and.returnValue(Promise.resolve(1));
    component.form.patchValue({
      title: 'My Card',
      type: 'debit_card',
      cardLimit: null,
      dueDate: 10,
      brand: 'visa',
      lastDigits: '1234',
    });
    component.item = undefined!;

    await component.onSubmit();

    expect(cardServiceSpy.createCard).toHaveBeenCalled();
    expect(toastCtrlSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Cartão adicionado com sucesso!' })
    );
    expect(toastSpy.present).toHaveBeenCalled();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith({ updated: true });
  }));

  it('should call updateCard and dismiss modal on valid existing card submission', fakeAsync(async () => {
    cardServiceSpy.updateCard.and.returnValue(Promise.resolve(1));
    component.item = UPDATE_CARD_MOCK;
    component.form.patchValue({ ...UPDATE_CARD_MOCK });

    await component.onSubmit();

    expect(cardServiceSpy.updateCard).toHaveBeenCalled();
    expect(toastCtrlSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Cartão editado com sucesso!' })
    );
    expect(toastSpy.present).toHaveBeenCalled();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalledWith({ updated: true });
  }));

  it('should handle error on createCard and show toast', fakeAsync(async () => {
    const error = new Error('Create failed');
    cardServiceSpy.createCard.and.returnValue(Promise.reject(error));

    component.form.patchValue({ ...CREATE_CARD_MOCK });

    component.item = undefined!;

    await component.onSubmit();

    expect(toastCtrlSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: `Erro ao salvar cartão: ${error.message}`,
        color: 'danger',
      })
    );
    expect(toastSpy.present).toHaveBeenCalled();
  }));

  it('should dismiss modal on dismiss call', async () => {
    await component.dismiss();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalled();
  });
});
