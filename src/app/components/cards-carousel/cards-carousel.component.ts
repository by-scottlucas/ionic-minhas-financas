import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { CardFormComponent } from '../card-form/card-form.component';

register();

@Component({
  selector: 'app-cards-carousel',
  templateUrl: './cards-carousel.component.html',
  styleUrls: ['./cards-carousel.component.scss'],
})
export class CardsCarouselComponent implements OnInit {
  cards: any[] = [];
  isLoading: boolean = true;
  cardTransactions: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

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
          brand: {
            value: 'visa',
            label: 'Visa',
          },
          lastDigits: 1234,
          type: {
            value: 'credit_card',
            label: 'Cartão de Crédito',
          },
          limit: 3000,
          due_day: 10,
        },
      ];
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

  async openAddCardModal() {
    const modal = await this.modalCtrl.create({
      component: CardFormComponent,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    modal.present();
  }

  async presentCardActions(card: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `${card.name}`,
      mode: 'ios',
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => {
            this.editCard(card);
          },
        },
        {
          text: 'Excluir',
          role: 'destructive',
          icon: 'trash-outline',
          handler: () => {
            this.deleteCard(card);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close-outline',
        },
      ],
    });

    await actionSheet.present();
  }

  async editCard(card: any) {
    const modal = await this.modalCtrl.create({
      component: CardFormComponent,
      componentProps: {
        item: card,
      },
      cssClass: 'glass-modal',
    });
    await modal.present();
  }

  deleteCard(card: any) {
    const index = this.cards.indexOf(card);
    if (index > -1) {
      this.cards.splice(index, 1);
    }
  }
}
