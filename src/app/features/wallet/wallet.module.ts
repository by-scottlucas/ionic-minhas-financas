import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { WalletPage } from './pages/wallet.page';
import { WalletRoutingModule } from './wallet-routing.module';
import { BalanceHeaderComponent } from './components/balance-header/balance-header.component';

@NgModule({
  imports: [SharedModule, WalletRoutingModule],
  declarations: [WalletPage, BalanceHeaderComponent],
})
export class WalletModule {}
