import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, IonItemSliding, ModalController } from '@ionic/angular';
import { WalletService } from 'src/app/features/wallet/services/wallet.service';

import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { TransactionDTO } from 'src/app/features/wallet/models/transaction.dto';
import { TransactionCategoryEnum, TransactionCategoryLabels } from 'src/app/features/wallet/models/transaction-category.enum';
import { PaymentMethodEnum, PaymentMethodEnumLabels } from 'src/app/features/wallet/models/payment-method.enum';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent {
  @Input() isLoading: boolean = false;
  @Input() transactions: TransactionDTO[] = [];
  @Output() updated = new EventEmitter<void>();

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private walletService: WalletService
  ) {}

  async onEditTransaction(data: TransactionDTO, slidingItem: IonItemSliding) {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
      componentProps: {
        transaction: data,
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

    await slidingItem.close();
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
            await this.walletService.deleteTransaction(transaction.id!);
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
