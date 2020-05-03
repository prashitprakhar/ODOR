import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartnerOrderListPage } from './partner-order-list.page';
import { OrderItemsDetailsComponent } from 'src/app/enterprise-partner-modals/order-items-details/order-items-details.component';

const routes: Routes = [
  {
    path: '',
    component: PartnerOrderListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PartnerOrderListPage, OrderItemsDetailsComponent],
  entryComponents: [OrderItemsDetailsComponent]
})
export class PartnerOrderListPageModule {}
