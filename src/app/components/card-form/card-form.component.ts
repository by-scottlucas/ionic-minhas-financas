import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

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

  @Input() item: any;
  @Input() headerTitle: string = 'Novo Cartão';

  form!: FormGroup;

  isDateModalOpen = false;
  selectedDate: string = '';
  formattedDate: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) {
    const now = new Date().toISOString();
    this.updateFormattedDate(now);

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      limit: [null],
      date: [null],
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
        title: this.item.name,
        type: this.item.type.value,
        limit: this.item.limit,
        date: this.item.due_date,
        brand: this.item.brand.value,
        lastDigits: this.item.lastDigits,
      });

      this.updateFormattedDate(this.item.date);
    }
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

  onTypeChange(event: any) {
    const selectedType = event.detail.value;
    if (selectedType === 'credit_card') {
      this.form
        .get('limit')
        ?.setValidators([Validators.required, Validators.min(0)]);
      this.form.get('date')?.setValidators([Validators.required]);
    } else {
      this.form.get('limit')?.clearValidators();
      this.form.get('date')?.clearValidators();
      this.form.get('limit')?.setValue(null);
      this.form.get('date')?.setValue('');
    }
    this.form.get('limit')?.updateValueAndValidity();
    this.form.get('date')?.updateValueAndValidity();
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

    if (input.value.length >= 4 && /^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.modalCtrl.dismiss(this.form.value);
    } else {
      console.warn('Formulário inválido');
      this.form.markAllAsTouched();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
