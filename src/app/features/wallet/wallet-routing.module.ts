import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WalletPage } from './pages/wallet.page';

const routes: Routes = [
  {
    path: '',
    component: WalletPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletRoutingModule {}
