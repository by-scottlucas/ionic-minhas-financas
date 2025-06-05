import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { CardDTO } from 'src/app/models/card.dto';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { CardService } from 'src/app/services/card.service';
import { TransactionService } from 'src/app/services/transaction.service';
import {
  CATEGORY_SELECT_OPTIONS,
  PAYMENT_METHOD_SELECT_OPTIONS,
  TYPE_SELECT_OPTIONS,
} from 'src/app/shared/shared/constants/select-options.constants';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent implements OnInit {
  @Input() item!: TransactionDTO;
  @Input() headerTitle!: string;

  form!: FormGroup;

  showCreditCardSelect: boolean = false;
  creditCards: CardDTO[] = [];

  isDateModalOpen: boolean = false;
  selectedDate: string = '';
  formattedDate: string = '';

  readonly typeOptions = TYPE_SELECT_OPTIONS;
  readonly categoryOptions = CATEGORY_SELECT_OPTIONS;
  readonly paymentOptions = PAYMENT_METHOD_SELECT_OPTIONS;

  constructor(
    private formBuilder: FormBuilder,
    private cardService: CardService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private transactionService: TransactionService
  ) {
    const now = new Date().toISOString();
    this.updateFormattedDate(now);

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      price: [, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      date: [now, Validators.required],
      paymentMethod: ['', Validators.required],
      creditCard: [null],
    });
  }

  ngOnInit(): void {
    if (this.item) {
      this.form.patchValue({
        title: this.item.title,
        type: this.item.type,
        price: this.item.price,
        category: this.item.category,
        date: this.item.date,
        paymentMethod: this.item.paymentMethod,
        creditCard: this.item.cardId,
      });
    }

    this.listCreditCards();

    this.form.get('paymentMethod')?.valueChanges.subscribe((value) => {
      this.onPaymentMethodChange(value);
    });

    this.onPaymentMethodChange(this.form.get('paymentMethod')?.value);
  }

  async listCreditCards() {
    this.cardService.listCards().then((response) => {
      this.creditCards = response.filter((card) => card.type === 'credit_card');
    });
  }

  openDatepicker() {
    this.isDateModalOpen = true;
  }

  onDateChange(event: any) {
    const newDate = event.detail.value;
    this.updateFormattedDate(newDate);
    this.isDateModalOpen = false;
    this.form.get('date')?.setValue(newDate);
  }

  private updateFormattedDate(dateString: string) {
    const date = new Date(dateString);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();

    this.formattedDate = `${dia}/${mes}/${ano}`;
    this.selectedDate = dateString;
  }

  blockNegativeInput(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'Minus') {
      event.preventDefault();
    }
  }

  onPaymentMethodChange(method: string) {
    this.showCreditCardSelect = method === 'credit_card';

    if (!this.showCreditCardSelect) {
      this.form.get('creditCard')?.setValue(null);
      this.form.get('creditCard')?.clearValidators();
    } else {
      this.form.get('creditCard')?.setValidators(Validators.required);
    }

    this.form.get('creditCard')?.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const transaction: TransactionDTO = {
        id: this.item ? this.item.id : undefined,
        title: formValue.title,
        type: formValue.type,
        price: formValue.price,
        category: formValue.category,
        date: new Date(formValue.date),
        paymentMethod: formValue.paymentMethod,
        cardId: this.showCreditCardSelect ? formValue.creditCard : undefined,
      };

      if (
        transaction.type === 'withdrawal' &&
        transaction.paymentMethod === 'credit_card' &&
        transaction.cardId
      ) {
        const selectedCard = this.creditCards.find((card) => {
          card.id === transaction.cardId;
        });

        if (
          selectedCard &&
          selectedCard.cardLimit !== undefined &&
          selectedCard.cardUsage !== undefined
        ) {
          const availableLimit =
            selectedCard.cardLimit - selectedCard.cardUsage;
          if (transaction.price > availableLimit) {
            await this.presentAlert(
              'Limite Insuficiente',
              `Você não tem limite suficiente no "${selectedCard.title}".
               Limite disponível: R$ ${availableLimit.toFixed(2)}.`
            );
            return;
          }
        }
      }

      if (
        transaction.type === 'entry' &&
        transaction.paymentMethod === 'credit_card' &&
        transaction.cardId
      ) {
        const selectedCard = this.creditCards.find(
          (card) => card.id === transaction.cardId
        );

        if (selectedCard) {
          await this.cardService.increaseCardLimitUsage(
            transaction.cardId,
            transaction.price
          );
          await this.presentAlert(
            'Fatura paga',
            `O valor de R$ ${transaction.price.toFixed(2)}
            foi pago na fatura do cartão ${selectedCard.title}.`
          );
        }
      }

      try {
        if (this.item && this.item.id) {
          await this.transactionService.updateTransaction(transaction);
        } else {
          await this.transactionService.createTransaction(transaction);
        }

        await this.modalCtrl.dismiss({ updated: true });
      } catch (error) {
        console.error('Erro ao salvar transação:', error);
        await this.presentAlert(
          'Erro',
          'Ocorreu um erro ao salvar a transação. Tente novamente.'
        );
      }
    } else {
      console.warn('Formulário inválido');
      this.form.markAllAsTouched();
      await this.presentAlert(
        'Formulário Inválido',
        'Por favor, preencha todos os campos obrigatórios.'
      );
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo é obrigatório.';
      }
      if (control.errors?.['min']) {
        return 'O valor deve ser maior ou igual a 0.';
      }
    }
    return '';
  }
}
