import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderCartoesComponent } from './header-cartoes.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [HeaderCartoesComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[HeaderCartoesComponent]
})
export class HeaderCartoesModule { }
