import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'cards',
    loadChildren: () =>
      import('./pages/cards/cards.module').then((m) => m.CartoesPageModule),
  },
  {
    path: 'investimentos',
    loadChildren: () =>
      import('./pages/investimentos/investimentos.module').then(
        (m) => m.InvestimentosPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
