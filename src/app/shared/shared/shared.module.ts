import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarComponent } from 'src/app/components/tab-bar/tab-bar.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    TabBarComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    IonicModule,
    TabBarComponent
  ],
})
export class SharedModule {}
