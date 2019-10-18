import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ItemSelectionPage } from './item-selection.page';
import { CustomOrderModalComponent } from '../../modals/custom-order-modal/custom-order-modal.component';
import { ReactiveFormsModule } from '@angular/forms'

const routes: Routes = [
  {
    path: '',
    component: ItemSelectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [CustomOrderModalComponent],
  declarations: [ItemSelectionPage, CustomOrderModalComponent]
})
export class ItemSelectionPageModule {}
