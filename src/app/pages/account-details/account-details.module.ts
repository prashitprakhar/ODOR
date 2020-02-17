import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { AccountDetailsPage } from "./account-details.page";
import { AllMyOrdersModalComponent } from "src/app/modals/all-my-orders-modal/all-my-orders-modal.component";

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
  ],
  declarations: [
    AccountDetailsPage,
    AllMyOrdersModalComponent,
  ]
})
export class AccountDetailsPageModule {}
