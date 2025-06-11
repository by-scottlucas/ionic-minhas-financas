import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { CardDTO } from 'src/app/models/card.dto';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
})
export class CardFormComponent implements OnInit {
  typeSelectOptions = [
    { value: 'debit_card', label: 'Débito' },
    { value: 'credit_card', label: 'Crédito' },
  ];

  cardBrandOptions = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'elo', label: 'Elo' },
    { value: 'american_express', label: 'American Express' },
    { value: 'other', label: 'Outra' },
  ];

  @Input() item!: CardDTO;
  @Input() headerTitle!: string;

  form!: FormGroup;

  constructor(
    private cardService: CardService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      cardLimit: [null],
      dueDate: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(31),
          Validators.pattern(/^\d{1,2}$/),
        ],
      ],
      brand: ['', Validators.required],
      lastDigits: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(9999),
          Validators.pattern(/^\d{1,4}$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (this.item) {
      this.form.patchValue({
        title: this.item.title,
        type: this.item.type,
        cardLimit: this.item.cardLimit || null,
        dueDate: this.item.dueDate || null,
        brand: this.item.brand,
        lastDigits: this.item.lastDigits,
      });

      if (this.item.type === 'credit_card') {
        this.form
          .get('cardLimit')
          ?.setValidators([Validators.required, Validators.min(0)]);
        this.form
          .get('dueDate')
          ?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(31),
            Validators.pattern(/^\d{1,2}$/),
          ]);
        this.form.get('cardLimit')?.updateValueAndValidity();
        this.form.get('dueDate')?.updateValueAndValidity();
      }
    }
  }

  onTypeChange(event: any) {
    const selectedType = event.detail.value;
    if (selectedType === 'credit_card') {
      this.form
        .get('cardLimit')
        ?.setValidators([Validators.required, Validators.min(0)]);
      this.form
        .get('dueDate')
        ?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(31),
          Validators.pattern(/^\d{1,2}$/),
        ]);
    } else {
      this.form.get('cardLimit')?.clearValidators();
      this.form.get('dueDate')?.clearValidators();
      this.form.get('cardLimit')?.setValue(null);
      this.form.get('dueDate')?.setValue(null);
    }
    this.form.get('cardLimit')?.updateValueAndValidity();
    this.form.get('dueDate')?.updateValueAndValidity();
  }

  blockNegativeInput(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'Minus') {
      event.preventDefault();
    }
  }

  blockInvalidNumberInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    const invalidKeys = ['e', 'E', '+', '-', '.', ','];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }

    const controlKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
    ];
    if (controlKeys.includes(event.key)) {
      return;
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    toast.present();
  }

  async onSubmit() {
    if (this.form.invalid) {
      await this.presentToast(
        'Por favor, preencha todos os campos obrigatórios corretamente.',
        'danger'
      );
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const parsedCardLimit =
      formValue.cardLimit !== null && formValue.cardLimit !== ''
        ? parseFloat(formValue.cardLimit)
        : null;

    const parsedDueDate =
      formValue.dueDate !== null && formValue.dueDate !== ''
        ? parseInt(formValue.dueDate, 10)
        : null;

    const parsedLastDigits =
      formValue.lastDigits !== null && formValue.lastDigits !== ''
        ? parseInt(formValue.lastDigits, 10)
        : null;

    if (isNaN(parsedCardLimit!) && parsedCardLimit !== null) {
      await this.presentToast(
        'Erro de conversão: Limite do cartão inválido.',
        'danger'
      );
      return;
    }
    if (isNaN(parsedDueDate!) && parsedDueDate !== null) {
      await this.presentToast(
        'Erro de conversão: Vencimento inválido.',
        'danger'
      );
      return;
    }
    if (isNaN(parsedLastDigits!) && parsedLastDigits !== null) {
      await this.presentToast(
        'Erro de conversão: Últimos dígitos inválidos.',
        'danger'
      );
      return;
    }

    const card: CardDTO = {
      id: this.item ? this.item.id : undefined,
      title: formValue.title,
      type: formValue.type,
      cardLimit: parsedCardLimit!,
      dueDate: parsedDueDate!,
      brand: formValue.brand,
      lastDigits: parsedLastDigits!,
    };

    try {
      if (this.item && this.item.id) {
        await this.cardService.updateCard(card);
        await this.presentToast('Cartão editado com sucesso!', 'success');
      } else {
        await this.cardService.createCard(card);
        await this.presentToast('Cartão adicionado com sucesso!', 'success');
      }

      await this.modalCtrl.dismiss({ updated: true });
    } catch (error: any) {
      const errorMessage = error.message
        ? error.message
        : 'Ocorreu um erro desconhecido.';
      await this.presentToast(
        `Erro ao salvar cartão: ${errorMessage}`,
        'danger'
      );
      console.error('Erro ao salvar/atualizar card.');
    }
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
