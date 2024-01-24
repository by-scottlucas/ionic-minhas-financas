import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ListaModule } from 'src/app/components/lista/lista.module';
import { CadastroModule } from 'src/app/components/cadastro/cadastro.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HeaderModule,
    ListaModule,
    CadastroModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
