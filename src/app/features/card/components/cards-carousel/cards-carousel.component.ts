import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { CardService } from 'src/app/features/card/services/card.service';
import { WalletService } from 'src/app/features/wallet/services/wallet.service';
import { CardDTO } from 'src/app/features/card/models/card.dto';
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
  @Input() isLoading: boolean = false;
  showSwiper: boolean = true;

  constructor(
    private cardService: CardService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.loadCards();

    this.cardService.cardsChanged$.subscribe(() => {
      this.loadCards();
    });

    this.walletService.transactionsChanged$.subscribe(() => {
      this.loadCards();
    });
  }

  async loadCards() {
    this.showSwiper = false;
    try {
      await this.delay(500);
      this.cardsData = await this.cardService.listCards();
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    } finally {
      this.showSwiper = this.cardsData.length > 0;
    }
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
      return Math.min(((card.cardUsage || 0) / card.cardLimit) * 100, 100);
    }
    return 0;
  }

  getAvailableLimit(card: CardDTO): number {
    if (card.type === 'credit_card' && card.cardLimit) {
      return card.cardLimit - (card.cardUsage || 0);
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
          this.loadCards();
        } else {
          console.error('Erro: ID do cartão não encontrado para exclusão.');
        }
      } catch (error) {
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
