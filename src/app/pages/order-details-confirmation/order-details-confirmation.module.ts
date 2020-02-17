import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderDetailsConfirmationPage } from './order-details-confirmation.page';
// import { OrderConfirmedModalComponent } from 'src/app/modals/order-confirmed-modal/order-confirmed-modal.component';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailsConfirmationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderDetailsConfirmationPage],
  entryComponents: []
})
export class OrderDetailsConfirmationPageModule {}
