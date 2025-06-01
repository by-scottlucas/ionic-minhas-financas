import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared/shared.module';
import { InvestimentosPageRoutingModule } from './investimentos-routing.module';
import { InvestimentosPage } from './investimentos.page';

@NgModule({
  imports: [
    InvestimentosPageRoutingModule,
    SharedModule
],
  declarations: [InvestimentosPage]
})
export class InvestimentosPageModule {}
