import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderPlacedSuccessPage } from './order-placed-success.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPlacedSuccessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderPlacedSuccessPage]
})
export class OrderPlacedSuccessPageModule {}
