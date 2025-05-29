import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarComponent } from 'src/app/components/tab-bar/tab-bar.component';
import { IonicModule } from '@ionic/angular';
import { CardHeaderComponent } from 'src/app/components/card-header/card-header.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TabBarComponent,
    CardHeaderComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  exports: [
    IonicModule,
    FormsModule,
    TabBarComponent,
    CardHeaderComponent
  ],
})
export class SharedModule {}
