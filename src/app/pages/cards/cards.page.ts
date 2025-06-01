import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {
  cardTransactions: any[] = [];
  isLoading = true;

  constructor() {}

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
          category: { value: 'food', label: 'Alimentação' },
          date: this.formatDate(today),
          paymentMethod: { value: 'debit_card', label: 'Cartão de Débito' },
          name: 'Supermercado Extra',
          price: 123.45,
        },
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
        {
          type: { value: 'withdrawal', label: 'Saída' },
          category: { value: 'food', label: 'Alimentação' },
          date: this.formatDate(lastWeek),
          paymentMethod: { value: 'pix', label: 'Pix' },
          name: 'iFood',
          price: 76.5,
        },
        {
          type: { value: 'withdrawal', label: 'Saída' },
          category: { value: 'shopping', label: 'Compras' },
          date: this.formatDate(lastMonth),
          paymentMethod: { value: 'credit_card', label: 'Cartão de Crédito' },
          name: 'Amazon',
          price: 199.99,
        },
        {
          type: { value: 'withdrawal', label: 'Saída' },
          category: { value: 'health', label: 'Saúde' },
          date: this.formatDate(lastWeek),
          paymentMethod: { value: 'debit_card', label: 'Cartão de Débito' },
          name: 'Farmácia',
          price: 58.25,
        },
        {
          type: { value: 'withdrawal', label: 'Saída' },
          category: { value: 'transport', label: 'Transporte' },
          date: this.formatDate(today),
          paymentMethod: { value: 'cash', label: 'Dinheiro' },
          name: 'Uber',
          price: 34.8,
        },
        {
          type: { value: 'withdrawal', label: 'Saída' },
          category: { value: 'food', label: 'Alimentação' },
          date: this.formatDate(lastWeek),
          paymentMethod: { value: 'cash', label: 'Dinheiro' },
          name: 'Padaria do Bairro',
          price: 21.75,
        },
        {
          type: { value: 'withdrawal', label: 'Saída' },
          category: { value: 'shopping', label: 'Compras' },
          date: this.formatDate(lastMonth),
          paymentMethod: { value: 'credit_card', label: 'Cartão de Crédito' },
          name: 'Magazine Luiza',
          price: 499.99,
        },
        {
          type: { value: 'withdrawal', label: 'Saída' },
          category: { value: 'services', label: 'Serviço' },
          date: this.formatDate(today),
          paymentMethod: { value: 'pix', label: 'Pix' },
          name: 'Spotify',
          price: 19.9,
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

  openNewTransactionModal() {
    console.log('Abrir modal de nova transação');
  }

  openAddCardModal() {
    console.log('Abrir modal de adicionar cartão');
  }
}
