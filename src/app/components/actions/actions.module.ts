import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActionsComponent } from './actions.component';



@NgModule({
  declarations: [ActionsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [ActionsComponent]
})
export class ActionsModule { }
