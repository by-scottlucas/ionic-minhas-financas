import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  balanceTitle = 'Saldo do Mês';
  balanceValue = 7000.25;
  balanceIcon = 'trending-up-outline';

  firstTitle = 'Entradas';
  firstValue = 100.25;
  firstValuePositive = true;

  secondTitle = 'Saídas';
  secondValue = 49.9;
  secondValuePositive = false;

  transactionsData: TransactionDTO[] = [];

  constructor(
    private modalCtrl: ModalController,
    private transactionService: TransactionService
  ) {}

  async ngOnInit() {
    await this.loadTransactions();
  }

  async loadTransactions() {
    try {
      this.transactionsData = await this.transactionService.listTransactions();
      console.log('Transações carregadas:', this.transactionsData);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  }

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
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
}
