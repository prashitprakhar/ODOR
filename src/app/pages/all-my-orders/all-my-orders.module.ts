import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AllMyOrdersPage } from './all-my-orders.page';

const routes: Routes = [
  {
    path: '',
    component: AllMyOrdersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AllMyOrdersPage]
})
export class AllMyOrdersPageModule {}
