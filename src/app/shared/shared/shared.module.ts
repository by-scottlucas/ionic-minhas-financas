import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardHeaderComponent } from 'src/app/components/card-header/card-header.component';
import { CardsCarouselComponent } from 'src/app/components/cards-carousel/cards-carousel.component';
import { AdvancedFilterComponent } from 'src/app/components/filter-bar/advanced-filter.component';
import { FilterBarComponent } from 'src/app/components/filter-bar/filter-bar.component';
import { TabBarComponent } from 'src/app/components/tab-bar/tab-bar.component';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';
import { TransactionListComponent } from 'src/app/components/transaction-list/transaction-list.component';

@NgModule({
  declarations: [
    TabBarComponent,
    CardHeaderComponent,
    TransactionFormComponent,
    FilterBarComponent,
    AdvancedFilterComponent,
    TransactionListComponent,
    CardsCarouselComponent,
  ],
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule],
  exports: [
    IonicModule,
    FormsModule,
    CommonModule,
    TabBarComponent,
    CardHeaderComponent,
    TransactionFormComponent,
    FilterBarComponent,
    AdvancedFilterComponent,
    TransactionListComponent,
    CardsCarouselComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
