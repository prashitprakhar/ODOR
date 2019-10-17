import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddCustomOrdersPage } from './add-custom-orders.page';

const routes: Routes = [
  {
    path: '',
    component: AddCustomOrdersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddCustomOrdersPage]
})
export class AddCustomOrdersPageModule {}
