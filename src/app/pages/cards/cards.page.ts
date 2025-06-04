import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';
import { CardDTO } from 'src/app/models/card.dto';
import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { CardService } from 'src/app/services/card.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {
  isLoading: boolean = true;
  cardsData: CardDTO[] = [];
  cardTransactions: TransactionDTO[] = [];

  constructor(
    private cardService: CardService,
    private modalCtrl: ModalController,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadCards();
    this.getCardTransactions();
  }

  async loadCards() {
    this.isLoading = true;

    try {
      await this.delay(1000);
      this.cardsData = await this.cardService.listCards();
      console.log('Transações carregadas:', this.cardTransactions);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async getCardTransactions(): Promise<TransactionDTO[]> {
    const cardMethods = [
      PaymentMethodEnum.DEBIT_CARD,
      PaymentMethodEnum.CREDIT_CARD,
    ];

    const transactions = await this.transactionService.listTransactions();

    return transactions.filter((transaction) =>
      cardMethods.includes(transaction.paymentMethod)
    );
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount || 0);
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async openNewTransactionModal() {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    modal.present();
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
