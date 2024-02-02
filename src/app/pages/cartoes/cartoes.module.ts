import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartoesPageRoutingModule } from './cartoes-routing.module';

import { CartoesPage } from './cartoes.page';
import { HeaderCartoesModule } from 'src/app/components/header-cartoes/header-cartoes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartoesPageRoutingModule,
    HeaderCartoesModule
  ],
  declarations: [CartoesPage]
})
export class CartoesPageModule { }
