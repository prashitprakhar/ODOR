import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { AccountDetailsPage } from "./account-details.page";
import { AllMyOrdersModalComponent } from "src/app/modals/all-my-orders-modal/all-my-orders-modal.component";
import { UpdateUserProfileModalComponent } from 'src/app/modals/update-user-profile-modal/update-user-profile-modal.component';
// import { AddNewAddressModalComponent } from 'src/app/modals/add-new-address-modal/add-new-address-modal.component';
import { EditAddressModalComponent } from 'src/app/modals/edit-address-modal/edit-address-modal.component';

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
    // AddNewAddressModalComponent,
    EditAddressModalComponent
  ],
  declarations: [
    AccountDetailsPage,
    AllMyOrdersModalComponent,
    UpdateUserProfileModalComponent,
    // AddNewAddressModalComponent,
    EditAddressModalComponent
  ]
})
export class AccountDetailsPageModule {}
