import { Component, OnInit, OnDestroy } from '@angular/core'; // Adicionado OnDestroy
import { ModalController } from '@ionic/angular';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';
import { PaymentMethodEnum } from 'src/app/models/enums/transaction/payment-method.enum';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { TransactionService } from 'src/app/services/transaction.service';
import { Subscription } from 'rxjs'; // Importado Subscription

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit, OnDestroy { // Implementa OnDestroy
  isLoading: boolean = true;
  cardTransactions: TransactionDTO[] = [];

  private transactionsSubscription: Subscription | undefined; // Variável para a inscrição

  constructor(
    private modalCtrl: ModalController,
    private transactionService: TransactionService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadCardTransactions();

    // Assina o evento de alteração de transações do TransactionService
    this.transactionsSubscription = this.transactionService.transactionsChanged$.subscribe(async () => {
      console.log('CardsPage: Evento de transações alteradas recebido. Recarregando transações de cartão...');
      await this.loadCardTransactions(); // Recarrega as transações de cartão quando notificado
    });
  }

  ngOnDestroy(): void {
    // Desinscreva-se para evitar vazamentos de memória
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
  }

  async loadCardTransactions(): Promise<void> {
    this.isLoading = true;

    await this.delay(500); // Mantido o delay

    const cardMethods = [
      PaymentMethodEnum.DEBIT_CARD,
      PaymentMethodEnum.CREDIT_CARD,
    ];

    try {
      const allTransactions = await this.transactionService.listTransactions();

      this.cardTransactions = allTransactions.filter((transaction) =>
        cardMethods.includes(transaction.paymentMethod)
      );
    } catch (error) {
      console.error('Erro ao carregar transações de cartão:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onAddTransaction() {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    await modal.present();

    // Com a assinatura no service, o onDidDismiss para recarga não é mais necessário aqui.
    // Ele ainda pode ser útil se você precisar de uma lógica específica APÓS o modal fechar,
    // que não seja apenas a recarga de dados.
    // modal.onDidDismiss().then((detail) => {
    //   if (detail?.data?.updated) {
    //     this.loadCardTransactions();
    //   }
    // });
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
