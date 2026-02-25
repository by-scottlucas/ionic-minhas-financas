import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CardPage } from './pages/card.page';

const routes: Routes = [
  {
    path: '',
    component: CardPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRoutingModule {}
