import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarComponent } from './tab-bar.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [TabBarComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [TabBarComponent]
})
export class TabBarModule { }
