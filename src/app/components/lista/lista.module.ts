import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActionsModule } from '../actions/actions.module';
import { SearchBarModule } from '../search-bar/search-bar.module';
import { ListaComponent } from './lista.component';



@NgModule({
  declarations: [ListaComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SearchBarModule,
    ActionsModule
  ],
  exports: [ListaComponent]
})
export class ListaModule { }
