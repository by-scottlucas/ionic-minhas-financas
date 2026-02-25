import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { WalletService } from 'src/app/features/wallet/services/wallet.service';
import { FilterBarService } from 'src/app/shared/components/filter-bar/filter-bar.service';
import { TransactionFormComponent } from 'src/app/shared/components/transaction-form/transaction-form.component';
import { TransactionDTO } from '../models/transaction.dto';
import { TransactionTypeEnum } from '../models/transaction-type.enum';

@Component({
  selector: 'app-wallet',
  templateUrl: 'wallet.page.html',
  styleUrls: ['wallet.page.scss'],
})
export class WalletPage implements OnInit, OnDestroy {
  balanceTitle = 'Saldo do Mês';
  balanceValue = 0;
  balanceIcon = 'trending-up-outline';

  firstTitle = 'Entradas';
  firstValue = 0;
  firstValuePositive = true;

  secondTitle = 'Saídas';
  secondValue = 0;
  secondValuePositive = false;

  isLoading = true;

  transactionsData: TransactionDTO[] = [];
  private allTransactions: TransactionDTO[] = [];

  searchTerm = '';
  advancedFilters: any = null;

  private transactionsSubscription?: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private filterBarService: FilterBarService,
    private walletService: WalletService
  ) {}

  async ngOnInit() {
    await this.loadTransactions();
    this.transactionsSubscription =
      this.walletService.transactionsChanged$.subscribe(async () => {
        await this.loadTransactions();
      });
  }

  handleRefresh(event: CustomEvent) {
    this.loadTransactions().finally(() => {
      (event.target as HTMLIonRefresherElement).complete();
    });
  }

  ngOnDestroy(): void {
    this.transactionsSubscription?.unsubscribe();
  }

  async loadTransactions() {
    this.isLoading = true;
    try {
      await this.delay(1000);
      this.allTransactions = await this.walletService.listTransactions();
      this.applyFilters();
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
    this.transactionsData = this.filterBarService.filterTransactions(
      this.allTransactions,
      this.searchTerm,
      this.advancedFilters
    );
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
