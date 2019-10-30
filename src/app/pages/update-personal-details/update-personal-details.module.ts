import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UpdatePersonalDetailsPage } from './update-personal-details.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatePersonalDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UpdatePersonalDetailsPage]
})
export class UpdatePersonalDetailsPageModule {}
