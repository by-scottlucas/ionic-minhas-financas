import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent implements OnInit {
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
    { value: 'others', label: 'Outros' },
  ];

  paymentMethodSelectOptions = [
    { value: 'pix', label: 'Pix' },
    { value: 'money', label: 'Dinheiro' },
    { value: 'debit_card', label: 'Cartão de Débito' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
  ];

  @Input() item: any;
  @Input() headerTitle: string = 'Nova Movimentação';

  form!: FormGroup;

  isDateModalOpen = false;
  selectedDate: string = '';
  formattedDate: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
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
    });
  }

  ngOnInit(): void {
    if (this.item) {
      this.form.patchValue({
        title: this.item.title,
        type: this.item.type?.value || this.item.type,
        price: this.item.price,
        category: this.item.category?.value || this.item.category,
        date: this.item.date,
        paymentMethod:
          this.item.paymentMethod?.value || this.item.paymentMethod,
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

  blockNegativeInput(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'Minus') {
      event.preventDefault();
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const transaction: TransactionDTO = {
        title: formValue.title,
        type: formValue.type,
        price: formValue.price,
        category: formValue.category,
        date: new Date(formValue.date),
        paymentMethod: formValue.paymentMethod,
      };

      try {
        await this.transactionService.createTransaction(transaction);
        await this.modalCtrl.dismiss({ updated: true });
      } catch (error) {
        console.error('Erro ao salvar transação:', error);
      }
    } else {
      console.warn('Formulário inválido');
      this.form.markAllAsTouched();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
