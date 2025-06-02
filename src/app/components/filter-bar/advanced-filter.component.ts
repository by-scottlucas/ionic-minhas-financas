import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss'],
})
export class AdvancedFilterComponent {
  @Output() apply = new EventEmitter<any>();

  form: FormGroup;

  months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  types = [
    { value: 'entry', label: 'Entrada' },
    { value: 'withdrawal', label: 'Saída' },
  ];

  categories = [
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

  paymentMethods = [
    { value: 'pix', label: 'Pix' },
    { value: 'money', label: 'Dinheiro' },
    { value: 'debit-card', label: 'Cartão de Débito' },
    { value: 'credit-card', label: 'Cartão de Crédito' },
  ];

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.form = this.fb.group({
      month: [''],
      year: [''],
      type: [''],
      category: [''],
      paymentMethod: [''],
      minValue: [null],
      maxValue: [null],
    });
  }

  clearFilters() {
    this.form.reset();
    this.modalCtrl.dismiss();
  }

  applyFilters() {
    if (this.form.valid) {
      this.modalCtrl.dismiss(this.form.value);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
