import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { AccountDetailsPage } from "./account-details.page";
import { AllMyOrdersModalComponent } from "src/app/modals/all-my-orders-modal/all-my-orders-modal.component";
import { UpdateUserProfileModalComponent } from 'src/app/modals/update-user-profile-modal/update-user-profile-modal.component';
import { AddNewAddressModalComponent } from 'src/app/modals/add-new-address-modal/add-new-address-modal.component';
import { ViewSavedAddressesModalComponent } from 'src/app/modals/view-saved-addresses-modal/view-saved-addresses-modal.component';

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
    UpdateUserProfileModalComponent,
    AddNewAddressModalComponent,
    ViewSavedAddressesModalComponent
  ],
  declarations: [
    AccountDetailsPage,
    AllMyOrdersModalComponent,
    UpdateUserProfileModalComponent,
    AddNewAddressModalComponent,
    ViewSavedAddressesModalComponent
  ]
})
export class AccountDetailsPageModule {}
