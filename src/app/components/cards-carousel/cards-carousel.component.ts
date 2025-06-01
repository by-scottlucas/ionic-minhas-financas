import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-cards-carousel',
  templateUrl: './cards-carousel.component.html',
  styleUrls: ['./cards-carousel.component.scss'],
})
export class CardsCarouselComponent implements OnInit {
openAddCardModal() {
throw new Error('Method not implemented.');
}
  cards: any[] = [];
  isLoading: boolean = true;
  cardTransactions: any[] = [];

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.loadCards();
    }, 500);
  }

  async loadCards() {
    this.isLoading = true;
    try {
      this.cards = [
        {
          name: 'Cartão Nubank',
          brand: 'visa',
          last_digits: '1234',
          type: 'credito',
          limit: 3000,
          due_day: 10,
        },
        {
          name: 'Cartão Inter',
          brand: 'mastercard',
          last_digits: '5678',
          type: 'debito',
        },
        {
          name: 'Cartão Itaú',
          brand: 'elo',
          last_digits: '4321',
          type: 'credito',
          limit: 5000,
          due_day: 5,
        },
        {
          name: 'Cartão C6 Bank',
          brand: 'american_express',
          last_digits: '8765',
          type: 'credito',
          limit: 2000,
          due_day: 15,
        },
      ];
      console.log('Cartões carregados:', this.cards);
    } catch (err) {
      console.error('Erro ao carregar cartões', err);
    }
    this.isLoading = false;
  }

  getUsage(card: any): number {
    const current = new Date();
    const filtered = this.cardTransactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getMonth() === current.getMonth() &&
        d.getFullYear() === current.getFullYear()
      );
    });
    return filtered.reduce((sum, t) => sum + t.amount, 0);
  }

  getBrandColor(brand: string): string {
    const map: any = {
      visa: '#1C80F0',
      mastercard: '#FF0045',
      elo: '#EAB308',
      american_express: '#22C55E',
    };
    return map[brand] || '#6b7280';
  }

  getUsagePercent(card: any): number {
    if (card.type === 'credito' && card.limit > 0) {
      const usage = this.getUsage(card);
      return Math.min((usage / card.limit) * 100, 100);
    }
    return 0;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount || 0);
  }
}
