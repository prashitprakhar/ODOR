import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AdminHomePage } from './admin-home.page';
import { AdminHomePageRoutingModule } from './admin-home-page-routing.module';

// const routes: Routes = [
//   {
//     path: '',
//     component: AdminHomePage
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    IonicModule,
    // RouterModule.forChild(routes),
    AdminHomePageRoutingModule
  ],
  declarations: [AdminHomePage]
})
export class AdminHomePageModule {}
