import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },  {
    path: 'resumo',
    loadChildren: () => import('./pages/resumo/resumo.module').then( m => m.ResumoPageModule)
  },
  {
    path: 'cartoes',
    loadChildren: () => import('./pages/cartoes/cartoes.module').then( m => m.CartoesPageModule)
  },
  {
    path: 'investimentos',
    loadChildren: () => import('./pages/investimentos/investimentos.module').then( m => m.InvestimentosPageModule)
  },
  {
    path: 'modal-actions',
    loadChildren: () => import('./components/pages/modal-actions/modal-actions.module').then( m => m.ModalActionsPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
