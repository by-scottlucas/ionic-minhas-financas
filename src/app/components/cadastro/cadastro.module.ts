import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CadastroComponent } from './cadastro.component';



@NgModule({
  declarations: [CadastroComponent],
  imports: [CommonModule, IonicModule],
  exports: [CadastroComponent]
})
export class CadastroModule { }
