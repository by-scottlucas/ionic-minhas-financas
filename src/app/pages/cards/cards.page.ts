import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {
  isLoading: boolean = true;
  cardTransactions: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadCardTransactions();
    }, 500);
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async loadCardTransactions() {
    try {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);

      this.cardTransactions = [
        {
          type: { value: 'withdrawal', label: 'Saída' },
          category: { value: 'transport', label: 'Transporte' },
          date: this.formatDate(today),
          paymentMethod: { value: 'credit_card', label: 'Cartão de Crédito' },
          name: 'Posto Shell',
          price: 89.9,
        },
        {
          type: { value: 'withdrawal', label: 'Saída' },
          category: { value: 'services', label: 'Serviço' },
          date: this.formatDate(lastWeek),
          paymentMethod: { value: 'credit_card', label: 'Cartão de Crédito' },
          name: 'Netflix',
          price: 39.9,
        },
      ];
      this.isLoading = false;
    } catch (err) {
      console.error('Erro ao carregar transações', err);
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount || 0);
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
}
