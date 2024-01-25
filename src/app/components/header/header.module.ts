import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CadastroModule } from '../cadastro/cadastro.module';
import { HeaderComponent } from './header.component';



@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
