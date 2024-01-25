import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaComponent } from './lista.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ListaComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [ListaComponent]
})
export class ListaModule { }
