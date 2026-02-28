import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdvancedFilterComponent } from 'src/app/shared/components/filter-bar/advanced-filter.component';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { TabBarComponent } from 'src/app/shared/components/tab-bar/tab-bar.component';
import { TransactionFormComponent } from 'src/app/shared/components/transaction-form/transaction-form.component';
import { TransactionListComponent } from 'src/app/shared/components/transaction-list/transaction-list.component';
import { BrlCurrencyPipe } from './pipes/brl-currency.pipe';

@NgModule({
  declarations: [
    TabBarComponent,
    TransactionFormComponent,
    FilterBarComponent,
    AdvancedFilterComponent,
    TransactionListComponent,
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    BrlCurrencyPipe,
  ],
  exports: [
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TabBarComponent,
    TransactionFormComponent,
    FilterBarComponent,
    AdvancedFilterComponent,
    TransactionListComponent,
    BrlCurrencyPipe
  ],
})
export class SharedModule {}
