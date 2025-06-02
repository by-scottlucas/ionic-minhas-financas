import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  balanceTitle = 'Saldo do Mês';
  balanceValue = 7000.25;
  balanceIcon = "trending-up-outline";

  firstTitle = 'Entradas';
  firstValue = 100.25;
  firstValuePositive = true;

  secondTitle = 'Saídas';
  secondValue = 49.9;
  secondValuePositive = false;

  constructor(private modalCtrl: ModalController) {}

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: TransactionFormComponent,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'glass-modal',
    });

    modal.present();
  }
}
