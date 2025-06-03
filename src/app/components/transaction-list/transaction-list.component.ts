import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import {
  TransactionCategoryEnum,
  TransactionCategoryLabels,
} from 'src/app/models/enums/transaction/transaction-category.enum';
import {
  PaymentMethodEnum,
  PaymentMethodEnumLabels,
} from 'src/app/models/enums/transaction/payment-method.enum';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent {
  @Input() transactions: TransactionDTO[] = [];

  constructor(private modalCtrl: ModalController) {}

  async onEdit(data: any) {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
      componentProps: {
        item: data,
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    modal.present();
  }

  onDelete() {}

  getCategoryLabel(category: string): string {
    return (
      TransactionCategoryLabels[category as TransactionCategoryEnum] || category
    );
  }

  getPaymentMethodLabel(paymentMethod: string): string {
    return (
      PaymentMethodEnumLabels[paymentMethod as PaymentMethodEnum] ||
      paymentMethod
    );
  }
}
