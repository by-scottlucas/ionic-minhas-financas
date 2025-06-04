// src/app/cards/cards-carousel/cards-carousel.component.ts

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
import { TransactionService } from 'src/app/services/transaction.service'; // Mantenha, pois o CardService ainda depende dele para o cálculo.
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
  showSwiper: boolean = true;
  // cardTransactions não é mais necessário aqui, pois o CardService já faz o cálculo
  // cardTransactions: TransactionDTO[] = [];

  constructor(
    private cardService: CardService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private transactionService: TransactionService // Mantenha injetado para o `transactionsChanged$`
  ) {}

  ngOnInit() {
    this.loadCards();

    // Inscreva-se nas mudanças do CardService para recarregar cartões
    this.cardService.cardsChanged$.subscribe(() => {
      this.loadCards();
    });

    // Inscreva-se nas mudanças do TransactionService também,
    // pois uma nova transação ou edição de transação afetaria o uso do cartão.
    this.transactionService.transactionsChanged$.subscribe(() => {
      this.loadCards();
    });
  }

  async loadCards() {
    this.isLoading = true;
    this.showSwiper = false;

    try {
      await this.delay(500);
      // O CardService agora retorna os cartões com cardUsage já calculado
      this.cardsData = await this.cardService.listCards();
      this.showSwiper = true;
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // A função getUsage não é mais necessária aqui, pois `card.cardUsage` já está disponível
  // Você pode remover essa função se não estiver sendo chamada em outro lugar.
  // getUsage(card: CardDTO): number {
  //   return card.cardUsage || 0;
  // }

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
      // Use card.cardUsage diretamente
      return Math.min(((card.cardUsage || 0) / card.cardLimit) * 100, 100);
    }
    return 0;
  }

  getAvailableLimit(card: CardDTO): number {
    if (card.type === 'credit_card' && card.cardLimit) {
      return card.cardLimit - (card.cardUsage || 0);
    }
    return 0; // Ou undefined, dependendo de como você quer lidar com débito
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
        this.loadCards(); // Recarrega para atualizar os dados do carrossel
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
        this.loadCards(); // Recarrega para atualizar os dados do carrossel
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
          this.loadCards(); // Recarrega para atualizar os dados do carrossel
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
