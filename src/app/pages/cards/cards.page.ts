import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';
import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit, OnDestroy {
  isLoading: boolean = true;
  cardTransactions: TransactionDTO[] = [];

  private transactionsSubscription: Subscription | undefined;

  constructor(
    private modalCtrl: ModalController,
    private transactionService: TransactionService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadCardTransactions();

    this.transactionsSubscription =
      this.transactionService.transactionsChanged$.subscribe(async () => {
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
      const allTransactions = await this.transactionService.listTransactions();

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
