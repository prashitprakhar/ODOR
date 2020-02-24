import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  ModalController,
  LoadingController,
  AlertController
} from "@ionic/angular";
import { ICustomerAddress } from "src/app/models/customer-address.model";
import { UserProfileService } from "src/app/services/user-profile.service";

@Component({
  selector: "app-add-new-address-modal",
  templateUrl: "./add-new-address-modal.component.html",
  styleUrls: ["./add-new-address-modal.component.scss"]
})
export class AddNewAddressModalComponent implements OnInit {
  public customerAddress: ICustomerAddress;

  constructor(
    private addNewAddressModalCtrl: ModalController,
    private userProfileService: UserProfileService,
    private addingNewAddressCtrl: LoadingController,
    private addressAddSuccessCtrl: AlertController,
    private failureAddAddressAlertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onClose() {
    this.addNewAddressModalCtrl.dismiss(null, "closed", "addNewAddressModal");
  }

  onSubmit(addressUpdateForm: NgForm) {
    if (!addressUpdateForm.valid) {
      return;
    }

    const addressCategory = addressUpdateForm.value.addressCategory;
    const houseNumber = addressUpdateForm.value.flatNumber;
    const addressLineOne = addressUpdateForm.value.addressLineOne;
    const addressLineTwo = addressUpdateForm.value.addressLineTwo;
    const pincode = addressUpdateForm.value.pincode;
    const city = addressUpdateForm.value.city;
    const state = addressUpdateForm.value.state;
    const mobileNumber = addressUpdateForm.value.mobileNumber;
    const isCurrentlyUsed: boolean = addressUpdateForm.value.isCurrentlyUsed;

    this.customerAddress = {
      addressCategory,
      houseNumber,
      addressLineOne,
      addressLineTwo,
      pincode,
      city,
      state,
      mobileNumber,
      isCurrentlyUsed
    };

    this.userProfileService
      .addNewAddress(this.customerAddress)
      .then(addressInfo => {
        this.addingNewAddressCtrl
          .create({
            message: "Adding New Address ..."
          })
          .then(loadingEl => {
            loadingEl.present();
            if (addressInfo) {
              loadingEl.dismiss();
              const header = "Successfully added address.";
              this.displaySuccessAlert(header, addressUpdateForm);
            } else {
              throw new Error("NEW_ADDRESS_ADD_FAILURE");
            }
          })
          .catch(err => {
            const header = "Oops... Something went wrong";
            const message = "New Address could not be added. Please try again";
            this.addAddressFailure(header, message);
          });
      })
      .catch(err => {
        const header = "Oops... Something went wrong";
        const message = "New Address could not be added. Please try again";
        this.addAddressFailure(header, message);
      });
  }

  addAddressFailure(header, message) {
    const alert = this.failureAddAddressAlertCtrl
      .create({
        header,
        message,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              // console.log("Shop is closed");
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  displaySuccessAlert(header, addressUpdateForm: NgForm) {
    const alert = this.addressAddSuccessCtrl
      .create({
        header,
        // message:
        //   "Please ",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              addressUpdateForm.reset();
              // console.log("Shop is closed");
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
        this.onClose();
      });
  }
}
