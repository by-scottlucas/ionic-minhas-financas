import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardHeaderComponent } from 'src/app/components/card-header/card-header.component';
import { TabBarComponent } from 'src/app/components/tab-bar/tab-bar.component';
import { TransactionFormComponent } from 'src/app/components/transaction-form/transaction-form.component';

@NgModule({
  declarations: [
    TabBarComponent,
    CardHeaderComponent,
    TransactionFormComponent
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
    TransactionFormComponent
  ],
})
export class SharedModule {}
