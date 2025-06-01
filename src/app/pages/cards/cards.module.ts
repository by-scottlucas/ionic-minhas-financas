import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared/shared.module';

import { CardsPageRoutingModule } from './cards-routing.module';
import { CardsPage } from './cards.page';

@NgModule({
  imports: [
    SharedModule,
    CardsPageRoutingModule,
  ],
  declarations: [CardsPage]
})
export class CartoesPageModule { }
