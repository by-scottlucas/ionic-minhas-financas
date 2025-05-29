import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InvestimentosPageRoutingModule } from './investimentos-routing.module';
import { InvestimentosPage } from './investimentos.page';
import { SharedModule } from "../../shared/shared/shared.module";

@NgModule({
  imports: [
    InvestimentosPageRoutingModule,
    SharedModule
],
  declarations: [InvestimentosPage]
})
export class InvestimentosPageModule {}
