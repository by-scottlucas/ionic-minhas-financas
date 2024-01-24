import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaComponent } from './lista.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ListaComponent],
  imports: [CommonModule, IonicModule],
  exports: [ListaComponent]
})
export class ListaModule { }
