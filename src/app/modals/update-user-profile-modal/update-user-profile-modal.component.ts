import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from "@angular/forms";
import { AddNewAddressModalComponent } from '../add-new-address-modal/add-new-address-modal.component';
import { ViewSavedAddressesModalComponent } from '../view-saved-addresses-modal/view-saved-addresses-modal.component';

@Component({
  selector: 'app-update-user-profile-modal',
  templateUrl: './update-user-profile-modal.component.html',
  styleUrls: ['./update-user-profile-modal.component.scss'],
})
export class UpdateUserProfileModalComponent implements OnInit {

  constructor(private updateProfileModalCtrl: ModalController,
              private addNewAddressModalCtrl: ModalController,
              private viewSavedAddressesModalCtrl: ModalController) { }

  ngOnInit() {}

  onClose() {
    this.updateProfileModalCtrl.dismiss(null, "closed", "userProfileUpdateModal");
  }

  onSubmit(addressUpdateForm: NgForm) {
    if (!addressUpdateForm.valid) {
      return;
    }

    console.log("addressCategory");
    // const email = addressUpdateForm.value.email;
    // const shopName = addressUpdateForm.value.shopName;
    // const shopAddressLineOne = addressUpdateForm.value.shopAddressLineOne;
    // const shopAddressLineTwo = addressUpdateForm.value.shopAddressLineTwo;
    // const shopPincode = addressUpdateForm.value.shopPincode;
    // const shopCity = addressUpdateForm.value.shopCity;
    // const shopState = addressUpdateForm.value.shopState;
    // const shopMobileNumber = addressUpdateForm.value.shopMobileNumber;
  }

  radioGroupChange(event) {
    console.log("Event triggered Radio Button", event);
  }

  viewSavedAddresses() {
    this.viewSavedAddressesModalCtrl
      .create({
        component: ViewSavedAddressesModalComponent,
        id: 'viewSavedAddressesModal'
      })
      .then(viewSavedAddressModalEl => {
        viewSavedAddressModalEl.present();
        return viewSavedAddressModalEl.onDidDismiss();
      })
      .then(data => {});
  }

  addNewAddress() {
    this.addNewAddressModalCtrl
      .create({
        component: AddNewAddressModalComponent,
        id: "addNewAddressModal"
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(data => {});
  }

  updateExistingAddress() {

  }

  updateSecurePIN() {

  }

}

/*
addressCategory: {
            type: String,
            trim: true,
            // required: true
        },
        houseNumber: {
            type: String,
            // required: true,
            trim: true
        },
        addressLineOne: {
            type: String,
            // required: true,
            trim: true
        },
        addressLineTwo: {
            type: String,
            trim: true
        },
        pincode: {
            type: Number,
            // required: true,
            trim: true
        },
        city: {
            type: String,
            // required: true,
            trim: true
        },
        state: {
            type: String,
            // required: true,
            trim: true
        },
        mobileNumber: {
            type: Number,
            // required: true,
            trim: true
        }
*/
