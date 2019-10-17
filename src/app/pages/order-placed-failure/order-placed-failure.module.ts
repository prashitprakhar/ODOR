import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderPlacedFailurePage } from './order-placed-failure.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPlacedFailurePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderPlacedFailurePage]
})
export class OrderPlacedFailurePageModule {}
