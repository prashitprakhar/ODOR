import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { AccountDetailsPage } from "./account-details.page";
import { AllMyOrdersModalComponent } from "src/app/modals/all-my-orders-modal/all-my-orders-modal.component";
import { LoginModalComponent } from "src/app/shared/modals/login-modal/login-modal.component";
import { SignupSuccessModalComponent } from "src/app/shared/modals/signup-success-modal/signup-success-modal.component";
import { SignupModalComponent } from "src/app/shared/modals/signup-modal/signup-modal.component";
import { PasswordResetModalComponent } from 'src/app/shared/modals/password-reset-modal/password-reset-modal.component';

const routes: Routes = [
  {
    path: "",
    component: AccountDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    AllMyOrdersModalComponent,
    LoginModalComponent,
    SignupModalComponent,
    SignupSuccessModalComponent,
    PasswordResetModalComponent
  ],
  declarations: [
    AccountDetailsPage,
    AllMyOrdersModalComponent,
    LoginModalComponent,
    SignupModalComponent,
    SignupSuccessModalComponent,
    PasswordResetModalComponent
  ]
})
export class AccountDetailsPageModule {}
