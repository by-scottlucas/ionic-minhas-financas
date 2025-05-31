import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent {
  transactions = [
    {
      type: {
        value: 'entry',
        label: 'Entrada',
      },
      category: {
        value: 'salary',
        label: 'Salário',
      },
      date: '30/08/2024',
      paymentMethod: {
        value: 'pix',
        label: 'Pix',
      },
      name: 'Salário de Maio',
      price: 3500.0,
    },
    {
      type: {
        value: 'withdrawal',
        label: 'Saída',
      },
      category: {
        value: 'food',
        label: 'Alimentação',
      },
      date: '29/08/2024',
      paymentMethod: {
        value: 'credit_card',
        label: 'Cartão de Crédito',
      },
      name: 'Mercado Assaí',
      price: 240.59,
    },
  ];

  constructor(private modalCtrl: ModalController) {}

  async onEdit(data: any) {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
      componentProps: {
        item: data
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    modal.present();
  }

  onDelete() {}
}
