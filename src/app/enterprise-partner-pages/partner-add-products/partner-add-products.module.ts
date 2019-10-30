import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartnerAddProductsPage } from './partner-add-products.page';

const routes: Routes = [
  {
    path: '',
    component: PartnerAddProductsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PartnerAddProductsPage]
})
export class PartnerAddProductsPageModule {}
