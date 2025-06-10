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
  @Input() headerTitle!: string;
  @Input() transaction!: TransactionDTO;

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
    if (this.transaction) {
      this.form.patchValue({
        title: this.transaction.title,
        type: this.transaction.type,
        price: this.transaction.price,
        category: this.transaction.category,
        date: this.transaction.date,
        paymentMethod: this.transaction.paymentMethod,
        creditCard: this.transaction.cardId,
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
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

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
    if (!this.form.valid) {
      await this.handleInvalidForm();
      return;
    }

    const transaction = this.buildTransaction();

    if (await this.hasInsufficientLimit(transaction)) return;

    await this.handleCardPaymentIfNeeded(transaction);
    await this.saveTransaction(transaction);
  }

  private buildTransaction(): TransactionDTO {
    const formValue = this.form.value;

    return {
      id: this.transaction ? this.transaction.id : undefined,
      title: formValue.title,
      type: formValue.type,
      price: formValue.price,
      category: formValue.category,
      date: new Date(formValue.date),
      paymentMethod: formValue.paymentMethod,
      cardId: this.showCreditCardSelect ? formValue.creditCard : undefined,
    };
  }

  private async hasInsufficientLimit(
    transaction: TransactionDTO
  ): Promise<boolean> {
    if (
      transaction.type !== 'withdrawal' ||
      transaction.paymentMethod !== 'credit_card' ||
      !transaction.cardId
    )
      return false;

    const selectedCard = this.creditCards.find(
      (card) => card.id === transaction.cardId
    );

    if (
      selectedCard &&
      selectedCard.cardLimit !== undefined &&
      selectedCard.cardUsage !== undefined
    ) {
      const availableLimit = selectedCard.cardLimit - selectedCard.cardUsage;
      if (transaction.price > availableLimit) {
        await this.presentAlert(
          'Limite Insuficiente',
          `Você não tem limite suficiente no "${selectedCard.title}".
           Limite disponível: R$ ${availableLimit.toFixed(2)}.`
        );
        return true;
      }
    }
    return false;
  }

  private async handleCardPaymentIfNeeded(transaction: TransactionDTO) {
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
  }

  private async saveTransaction(transaction: TransactionDTO) {
    try {
      if (this.transaction?.id) {
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
  }

  private async handleInvalidForm() {
    this.form.markAllAsTouched();
    await this.presentAlert(
      'Formulário Inválido',
      'Por favor, preencha todos os campos obrigatórios.'
    );
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
