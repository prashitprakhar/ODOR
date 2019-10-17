import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SomethingWentWrongPage } from './something-went-wrong.page';

const routes: Routes = [
  {
    path: '',
    component: SomethingWentWrongPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SomethingWentWrongPage]
})
export class SomethingWentWrongPageModule {}
