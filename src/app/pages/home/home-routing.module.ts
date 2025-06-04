import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'new',
    component: TransactionFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
