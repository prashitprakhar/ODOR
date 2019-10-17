import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePagePage } from './home-page.page';
import { HomePageRoutingModule } from './home-page-routing.module';

// const routes: Routes = [
//   {
//     path: '',
//     component: HomePagePage
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    IonicModule,
    HomePageRoutingModule
    // RouterModule.forChild(routes)
  ],
  declarations: [HomePagePage]
})
export class HomePagePageModule {}
