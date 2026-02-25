import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CardRoutingModule } from './card-routing.module';
import { CardFormComponent } from './components/card-form/card-form.component';
import { CardsCarouselComponent } from './components/cards-carousel/cards-carousel.component';
import { CardPage } from './pages/card.page';

@NgModule({
  imports: [SharedModule, CardRoutingModule],
  declarations: [CardPage, CardFormComponent, CardsCarouselComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CardModule {}
