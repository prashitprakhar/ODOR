import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthPage } from './auth.page';
import { SignupModalComponent } from 'src/app/shared/modals/signup-modal/signup-modal.component';
import { SignupSuccessModalComponent } from 'src/app/shared/modals/signup-success-modal/signup-success-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [SignupModalComponent, SignupSuccessModalComponent],
  declarations: [AuthPage, SignupModalComponent, SignupSuccessModalComponent]
})
export class AuthPageModule {}
