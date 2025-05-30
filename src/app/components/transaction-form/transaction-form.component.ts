import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent {
  typeSelectOptions = [
    { value: 'entry', label: 'Entrada' },
    { value: 'withdrawal', label: 'Saída' },
  ];

  categorySelectOptions = [
    { value: 'food', label: 'Alimentação' },
    { value: 'transport', label: 'Transporte' },
    { value: 'housing', label: 'Moradia' },
    { value: 'health', label: 'Saúde' },
    { value: 'education', label: 'Educação' },
    { value: 'leisure', label: 'Lazer' },
    { value: 'shopping', label: 'Compras' },
    { value: 'services', label: 'Serviços' },
    { value: 'salary', label: 'Salário' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investments', label: 'Investimentos' },
    { value: 'others', label: 'Outros' },
  ];

  paymentMethodSelectOptions = [
    { value: 'pix', label: 'Pix' },
    { value: 'money', label: 'Dinheiro' },
    { value: 'debit-card', label: 'Cartão de Débito' },
    { value: 'credit-card', label: 'Cartão de Crédito' },
    { value: 'investment-wallet', label: 'Carteira de Investimentos' },
  ];

  @Input() headerTitle: string = 'Nova Movimentação';

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
      price: [ , [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      date: [now, Validators.required],
      paymentMethod: ['', Validators.required],
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

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.modalCtrl.dismiss();
    } else {
      console.warn('Formulário inválido');
      this.form.markAllAsTouched();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
