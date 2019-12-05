import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderDetailsPage } from './order-details.page';
import { OrderConfirmedModalComponent } from 'src/app/modals/order-confirmed-modal/order-confirmed-modal.component';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderDetailsPage, OrderConfirmedModalComponent],
  entryComponents: [OrderConfirmedModalComponent]
})
export class OrderDetailsPageModule {}
