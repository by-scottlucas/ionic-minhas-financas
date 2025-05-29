import { NgModule } from '@angular/core';
import { ListaModule } from 'src/app/components/lista/lista.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';

import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';


@NgModule({
  imports: [
    HomePageRoutingModule,
    ListaModule,
    SharedModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
