import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardHeaderComponent } from 'src/app/components/card-header/card-header.component';
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
    TransactionListComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    IonicModule,
    FormsModule,
    TabBarComponent,
    CardHeaderComponent,
    TransactionFormComponent,
    FilterBarComponent,
    AdvancedFilterComponent,
    TransactionListComponent
  ],
})
export class SharedModule {}
