import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartnerHomePage } from './partner-home.page';
import { PartnerHomePageRoutingModule } from './partner-home-page-routing.module';

// const routes: Routes = [
//   {
//     path: '',
//     component: PartnerHomePage
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    //FormsModule,
    IonicModule,
    PartnerHomePageRoutingModule
    // RouterModule.forChild(routes)
  ],
  declarations: [PartnerHomePage]
})
export class PartnerHomePageModule {}
