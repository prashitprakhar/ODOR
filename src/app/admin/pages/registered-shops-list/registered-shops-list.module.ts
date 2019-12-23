import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegisteredShopsListPage } from './registered-shops-list.page';

const routes: Routes = [
  {
    path: '',
    component: RegisteredShopsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegisteredShopsListPage]
})
export class RegisteredShopsListPageModule {}
