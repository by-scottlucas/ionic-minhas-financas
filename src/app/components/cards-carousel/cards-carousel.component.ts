import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { CardDTO } from 'src/app/models/card.dto';
import { CardService } from 'src/app/services/card.service';
import { register } from 'swiper/element/bundle';

import { CardFormComponent } from '../card-form/card-form.component';

register();

@Component({
  selector: 'app-cards-carousel',
  templateUrl: './cards-carousel.component.html',
  styleUrls: ['./cards-carousel.component.scss'],
})
export class CardsCarouselComponent implements OnInit {
  cardsData: CardDTO[] = [];
  isLoading: boolean = true;
  cardTransactions: any[] = [];

  constructor(
    private cardService: CardService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.loadCards();
  }

  async loadCards() {
    this.isLoading = true;
    try {
      await this.delay(1000);
      this.cardsData = await this.cardService.listCards();
      console.log('Cartões carregados:', this.cardsData);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getUsage(card: CardDTO): number {
    const current = new Date();
    const filtered = (this.cardTransactions || []).filter((t: any) => {
      const d = new Date(t.date);
      return (
        d.getMonth() === current.getMonth() &&
        d.getFullYear() === current.getFullYear()
      );
    });
    return filtered.reduce((sum, t) => sum + (t.amount || 0), 0);
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

  getUsagePercent(card: CardDTO): number {
    if (card.type === 'credit_card' && card.cardLimit && card.cardLimit > 0) {
      const usage = this.getUsage(card);
      return Math.min((usage / card.cardLimit) * 100, 100);
    }
    return 0;
  }

  formatCurrency(amount: number | null | undefined): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount || 0);
  }

  async onAddCard() {
    const modal = await this.modalCtrl.create({
      component: CardFormComponent,
      componentProps: {
        headerTitle: 'Novo Cartão',
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    modal.onDidDismiss().then((detail) => {
      if (detail?.data?.updated) {
        this.loadCards();
      }
    });

    modal.present();
  }

  async presentCardActions(card: CardDTO) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `${card.title}`,
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

  async editCard(card: CardDTO) {
    const modal = await this.modalCtrl.create({
      component: CardFormComponent,
      componentProps: {
        item: card,
        headerTitle: 'Editar Cartão',
      },
      cssClass: 'glass-modal',
    });
    modal.onDidDismiss().then((detail) => {
      if (detail?.data?.updated) {
        this.loadCards();
      }
    });
    await modal.present();
  }

  async deleteCard(card: CardDTO) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir o cartão?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'destructive',
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

    if (role === 'destructive') {
      let loading: HTMLIonLoadingElement | undefined;

      try {
        loading = await this.loadingCtrl.create({
          message: 'Excluindo cartão...',
          spinner: 'crescent',
          translucent: true,
          cssClass: 'custom-loading',
        });
        await loading.present();

        if (card.id) {
          await this.cardService.deleteCard(card.id);
          await this.loadCards();
        } else {
          console.error('Erro: ID do cartão não encontrado para exclusão.');
        }
      } catch (error) {
        console.error('Erro ao excluir cartão:', error);
        const errorAlert = await this.alertCtrl.create({
          header: 'Erro',
          message: 'Não foi possível excluir o cartão. Tente novamente.',
          buttons: ['OK'],
        });
        await errorAlert.present();
      } finally {
        if (loading) {
          await loading.dismiss();
          loading = undefined;
        }
      }
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
