import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderInvestimentosComponent } from './header-investimentos.component';



@NgModule({
  declarations: [ HeaderInvestimentosComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [HeaderInvestimentosComponent]
})
export class HeaderInvestimentosModule { }
