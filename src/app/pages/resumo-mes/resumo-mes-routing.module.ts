import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumoMesPage } from './resumo-mes.page';

const routes: Routes = [
  {
    path: '',
    component: ResumoMesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumoMesPageRoutingModule {}
