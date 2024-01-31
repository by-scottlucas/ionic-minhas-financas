import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaComponent } from './lista.component';

@NgModule({
  declarations: [ListaComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports: [ListaComponent]
})
export class ListaModule { }
