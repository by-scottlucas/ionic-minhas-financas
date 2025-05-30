import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';

import { HomePage } from './home.page';
import { AdvancedFilterComponent } from 'src/app/components/filter-bar/advanced-filter.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'new',
    component: AdvancedFilterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
