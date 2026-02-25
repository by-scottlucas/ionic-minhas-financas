import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { WalletService } from 'src/app/features/wallet/services/wallet.service';
import { TransactionFormComponent } from 'src/app/shared/components/transaction-form/transaction-form.component';

import { TransactionDTO } from '../../wallet/models/transaction.dto';
import { PaymentMethodEnum } from '../../wallet/models/payment-method.enum';


@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit, OnDestroy {
  isLoading: boolean = true;
  cardTransactions: TransactionDTO[] = [];

  private transactionsSubscription: Subscription | undefined;

  constructor(
    private modalCtrl: ModalController,
    private walletService: WalletService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadCardTransactions();

    this.transactionsSubscription =
      this.walletService.transactionsChanged$.subscribe(async () => {
        await this.loadCardTransactions();
      });
  }

  handleRefresh(event: CustomEvent) {
    this.loadCardTransactions().finally(() => {
      (event.target as HTMLIonRefresherElement).complete();
    });
  }

  ngOnDestroy(): void {
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
  }

  async loadCardTransactions(): Promise<void> {
    this.isLoading = true;

    await this.delay(500);

    const cardMethods = [
      PaymentMethodEnum.DEBIT_CARD,
      PaymentMethodEnum.CREDIT_CARD,
    ];

    try {
      const allTransactions = await this.walletService.listTransactions();

      this.cardTransactions = allTransactions.filter((transaction) =>
        cardMethods.includes(transaction.paymentMethod)
      );
    } catch (error) {
      console.error('Erro ao carregar transações de cartão:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onAddTransaction() {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    await modal.present();
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
