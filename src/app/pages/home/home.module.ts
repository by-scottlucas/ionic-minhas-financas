import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CadastroModule } from 'src/app/components/cadastro/cadastro.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ListaModule } from 'src/app/components/lista/lista.module';

import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  imports: [
    HomePageRoutingModule,
    HeaderModule,
    ListaModule,
    CadastroModule,
    SharedModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
