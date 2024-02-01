import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestimentosPageRoutingModule } from './investimentos-routing.module';

import { HeaderInvestimentosModule } from 'src/app/components/header-investimentos/header-investimentos.module';
import { InvestimentosPage } from './investimentos.page';
import { ListaModule } from 'src/app/components/lista/lista.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestimentosPageRoutingModule,
    HeaderInvestimentosModule
  ],
  declarations: [InvestimentosPage]
})
export class InvestimentosPageModule {}
