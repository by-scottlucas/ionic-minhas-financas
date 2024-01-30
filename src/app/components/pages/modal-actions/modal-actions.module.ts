import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalActionsPageRoutingModule } from './modal-actions-routing.module';

import { ModalActionsPage } from './modal-actions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalActionsPageRoutingModule
  ],
  declarations: [ModalActionsPage]
})
export class ModalActionsPageModule {}
