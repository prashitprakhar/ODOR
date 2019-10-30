import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartnerOrderListPage } from './partner-order-list.page';

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
  declarations: [PartnerOrderListPage]
})
export class PartnerOrderListPageModule {}
