import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';
import { TransactionTypeEnum } from 'src/app/models/enums/transaction/transaction-type.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
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
  private allTransactions: TransactionDTO[] = [];

  searchTerm: string = '';
  advancedFilters: any = null;

  private transactionsSubscription: Subscription | undefined;

  constructor(
    private modalCtrl: ModalController,
    private transactionService: TransactionService
  ) {}

  async ngOnInit() {
    await this.loadTransactions();
    this.transactionsSubscription =
      this.transactionService.transactionsChanged$.subscribe(async () => {
        await this.loadTransactions();
      });
  }

  ngOnDestroy(): void {
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
  }

  async loadTransactions() {
    this.isLoading = true;

    try {
      await this.delay(1000);
      this.allTransactions = await this.transactionService.listTransactions();
      this.transactionsData = [...this.allTransactions];
      this.calculateCardValues();
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

    await modal.present();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  onFilterApplied(filters: any) {
    this.advancedFilters = filters;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allTransactions];

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const lower = this.searchTerm.toLowerCase();
      filtered = filtered.filter((t) => t.title?.toLowerCase().includes(lower));
    }

    this.transactionsData = filtered;
  }

  private calculateCardValues() {
    const transactions = [...this.allTransactions];
    this.firstValue = this.getMonthlyIncomes(transactions);
    this.secondValue = this.getMonthlyExpenses(transactions);
    this.balanceValue = this.getMonthlyBalance(transactions);
    this.balanceIcon =
      this.balanceValue >= 0 ? 'trending-up-outline' : 'trending-down-outline';
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
