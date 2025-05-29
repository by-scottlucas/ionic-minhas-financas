import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'new',
    component: TransactionFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
