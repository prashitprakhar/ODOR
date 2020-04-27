import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartnerMyShopPage } from './partner-my-shop.page';
import { EditItemDetailsModalComponent } from 'src/app/enterprise-partner-modals/edit-item-details-modal/edit-item-details-modal.component';
import { OrderItemsDetailsComponent } from 'src/app/enterprise-partner-modals/order-items-details/order-items-details.component';

const routes: Routes = [
  {
    path: '',
    component: PartnerMyShopPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents : [EditItemDetailsModalComponent],
  declarations: [PartnerMyShopPage, EditItemDetailsModalComponent]
})
export class PartnerMyShopPageModule {}
