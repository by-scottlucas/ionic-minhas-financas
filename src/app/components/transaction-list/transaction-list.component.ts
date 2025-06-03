import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import {
  PaymentMethodEnum,
  PaymentMethodEnumLabels,
} from 'src/app/models/enums/transaction/payment-method.enum';
import {
  TransactionCategoryEnum,
  TransactionCategoryLabels,
} from 'src/app/models/enums/transaction/transaction-category.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { TransactionService } from 'src/app/services/transaction.service';

import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent {
  @Input() transactions: TransactionDTO[] = [];
  @Output() updated = new EventEmitter<void>();

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private transactionService: TransactionService
  ) {}

  async onEditTransaction(data: TransactionDTO) {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
      componentProps: {
        item: data,
        headerTitle: 'Editar Movimentação',
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    await modal.present();

    const { data: result } = await modal.onWillDismiss();
    if (result?.updated) {
      this.updated.emit();
    }
  }

  async onDeleteTransaction(transaction: TransactionDTO) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir a transação?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: async () => {
            await this.transactionService.deleteTransaction(transaction.id!);
            this.updated.emit();
          },
        },
      ],
    });

    await alert.present();
  }

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
