import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartnerAccountDetailsPage } from './partner-account-details.page';

const routes: Routes = [
  {
    path: '',
    component: PartnerAccountDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PartnerAccountDetailsPage]
})
export class PartnerAccountDetailsPageModule {}
