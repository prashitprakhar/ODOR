import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AllShopsPage } from './all-shops.page';
import { NoInternetConnectivityModalComponent } from 'src/app/shared/modals/no-internet-connectivity-modal/no-internet-connectivity-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AllShopsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [NoInternetConnectivityModalComponent],
  declarations: [AllShopsPage, NoInternetConnectivityModalComponent]
})
export class AllShopsPageModule {}
