import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumoMesPageRoutingModule } from './resumo-mes-routing.module';

import { ResumoMesPage } from './resumo-mes.page';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumoMesPageRoutingModule,
    HeaderModule
  ],
  declarations: [ResumoMesPage]
})
export class ResumoMesPageModule {}
