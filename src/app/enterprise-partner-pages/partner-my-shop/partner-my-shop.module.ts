import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartnerMyShopPage } from './partner-my-shop.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [PartnerMyShopPage]
})
export class PartnerMyShopPageModule {}
