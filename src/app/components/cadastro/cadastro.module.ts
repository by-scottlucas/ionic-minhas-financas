import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CadastroComponent } from './cadastro.component';



@NgModule({
  declarations: [CadastroComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [CadastroComponent]
})
export class CadastroModule { }
