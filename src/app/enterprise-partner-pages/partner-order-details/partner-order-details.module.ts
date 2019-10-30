import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartnerOrderDetailsPage } from './partner-order-details.page';

const routes: Routes = [
  {
    path: '',
    component: PartnerOrderDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PartnerOrderDetailsPage]
})
export class PartnerOrderDetailsPageModule {}
