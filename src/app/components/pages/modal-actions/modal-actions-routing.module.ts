import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalActionsPage } from './modal-actions.page';

const routes: Routes = [
  {
    path: '',
    component: ModalActionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalActionsPageRoutingModule {}
