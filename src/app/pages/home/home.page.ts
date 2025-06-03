import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';
import { TransactionTypeEnum } from 'src/app/models/enums/transaction/transaction-type.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  balanceTitle: string = 'Saldo do Mês';
  balanceValue: number = 0;
  balanceIcon: string = 'trending-up-outline';

  firstTitle: string = 'Entradas';
  firstValue: number = 0;
  firstValuePositive: boolean = true;

  secondTitle: string = 'Saídas';
  secondValue: number = 0;
  secondValuePositive: boolean = false;

  isLoading: boolean = true;
  transactionsData: TransactionDTO[] = [];

  constructor(
    private modalCtrl: ModalController,
    private transactionService: TransactionService
  ) {}

  async ngOnInit() {
    await this.loadTransactions();
  }

  async loadTransactions() {
    this.isLoading = true;

    try {
      await this.delay(1000);

      this.transactionsData = await this.transactionService.listTransactions();
      console.log('Transações carregadas:', this.transactionsData);

      this.firstValue = this.getMonthlyIncomes(this.transactionsData);
      this.secondValue = this.getMonthlyExpenses(this.transactionsData);
      this.balanceValue = this.getMonthlyBalance(this.transactionsData);

      this.balanceIcon =
        this.balanceValue >= 0
          ? 'trending-up-outline'
          : 'trending-down-outline';
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onAddTransaction() {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
      componentProps: {
        headerTitle: 'Nova Movimentação',
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    modal.onDidDismiss().then((detail) => {
      if (detail?.data?.updated) {
        this.loadTransactions();
      }
    });

    await modal.present();
  }

  private getMonthlyIncomes(transactions: TransactionDTO[]): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter(
        (transaction) =>
          transaction.type === TransactionTypeEnum.Entry &&
          new Date(transaction.date).getMonth() === currentMonth &&
          new Date(transaction.date).getFullYear() === currentYear
      )
      .reduce((sum, transaction) => sum + transaction.price, 0);
  }

  private getMonthlyExpenses(transactions: TransactionDTO[]): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions
      .filter(
        (transaction) =>
          transaction.type === TransactionTypeEnum.WithDrawal &&
          new Date(transaction.date).getMonth() === currentMonth &&
          new Date(transaction.date).getFullYear() === currentYear
      )
      .reduce((sum, transaction) => sum + transaction.price, 0);
  }

  private getMonthlyBalance(transactions: TransactionDTO[]): number {
    const incomes = this.getMonthlyIncomes(transactions);
    const expenses = this.getMonthlyExpenses(transactions);
    return incomes - expenses;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
