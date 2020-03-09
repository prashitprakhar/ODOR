import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  AlertController,
  IonItemSliding,
  LoadingController
} from "@ionic/angular";
import { ICustomerAddress } from "src/app/models/customer-address.model";
import { UserProfileService } from "src/app/services/user-profile.service";
import { ICityDetails } from "src/app/models/city-abbreviation-model";
import { CommonUtilityService } from "src/app/shared/services/common-utility.service";
import { SortByService } from "src/app/shared/utils/sort-by.service";
import { EditAddressModalComponent } from "../edit-address-modal/edit-address-modal.component";
import { AddNewAddressModalComponent } from '../add-new-address-modal/add-new-address-modal.component';

@Component({
  selector: "app-view-saved-addresses-modal",
  templateUrl: "./view-saved-addresses-modal.component.html",
  styleUrls: ["./view-saved-addresses-modal.component.scss"]
})
export class ViewSavedAddressesModalComponent implements OnInit {
  public savedAddressesList: ICustomerAddress[] = [];
  // public cityDetails: ICityDetails;

  constructor(
    private viewSavedAddressesModalCtrl: ModalController,
    private userProfileService: UserProfileService,
    private commonUtilityService: CommonUtilityService,
    private sortByService: SortByService,
    private successAlertCtrl: AlertController,
    private failureAlertCtrl: AlertController,
    private editAddressModalCtrl: ModalController,
    private deleteConfirmAlertlCtrl: AlertController,
    private deleteLoadingCtrl: LoadingController,
    private deleteAddressSuccessAlertCtrl: AlertController,
    private deleteAddressFailAlertCtrl: AlertController,
    private addNewAddressModalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.userProfileService
      .getCustomerSavedAddresses()
      .then(addressList => {
        this.savedAddressesList = this.sortByService.sortCustomerAddress(
          addressList.addressList
        );
      })
      .catch(err => {
        this.savedAddressesList = [];
      });
  }

  getCityFullName(abbr): ICityDetails {
    return this.commonUtilityService.getCityDetails(abbr);
  }

  onClose() {
    this.viewSavedAddressesModalCtrl.dismiss(
      null,
      "closed",
      "viewSavedAddressesModal"
    );
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
      .then(data => {
        this.userProfileService
      .getCustomerSavedAddresses()
      .then(addressList => {
        this.savedAddressesList = this.sortByService.sortCustomerAddress(
          addressList.addressList
        );
      })
      .catch(err => {
        this.savedAddressesList = [];
      });
      });
  }

  changeUsageFlag(address) {
    this.userProfileService
      .updateAddressUsageFlag(address._id)
      .then(data => {
        this.savedAddressesList = this.sortByService.sortCustomerAddress(
          data.customerAddressList
        );
        this.userProfileService.getAndSetCustomerProfile();
        this.successCurrentUsedAddressChange();
      })
      .catch(err => {
        this.failureCurrentUsedAddressChange();
      });
  }

  editAddressDetails(address, editEl: IonItemSliding) {
    editEl.close();
    // this.editAddressModalCtrl.create
    this.editAddressModalCtrl
      .create({
        component: EditAddressModalComponent,
        componentProps: {
          name: "editAddressDetailsModal",
          // selectedShopId: this.shopId,
          addressDetails: address
        },
        id: "editAddressDetailsModal"
      })
      .then(editModalEl => {
        editModalEl.present();
        return editModalEl.onDidDismiss();
      })
      .then(data => {
        if (data.data) {
          this.savedAddressesList = this.sortByService.sortCustomerAddress(
            data.data.customerAddressList
          );
        }
      });
  }

  deleteAddressExecute(address: ICustomerAddress) {
    this.deleteLoadingCtrl
      .create({
        message: "Updating Address Details ..."
      })
      .then(loadingEl => {
        loadingEl.present();
        this.userProfileService
          .deleteAddress(address["_id"])
          .then(updatedCustomerProfileDoc => {
            loadingEl.dismiss();
            this.deleteAddressSuccessController(updatedCustomerProfileDoc);
          })
          .catch(err => {
            loadingEl.dismiss();
            this.deleteAddressFailureController();
            console.log("Error Occured while deleting address");
          });
      });
  }

  deleteAddress(address: ICustomerAddress, deleteAddressEl: IonItemSliding) {
    this.deleteConfirmAlertlCtrl
      .create({
        header: "Do you want to delete the Address ?",
        buttons: [
          {
            text: "DELETE",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              // itemDetailsForm.reset();
              this.deleteAddressExecute(address);
            }
          },
          {
            text: "CANCEL",
            handler: () => {
              deleteAddressEl.close();
            }
          }
        ]
      })
      .then(successAlertEl => {
        successAlertEl.present();
      });
  }

  successCurrentUsedAddressChange() {
    this.successAlertCtrl
      .create({
        header: "Successfully updated the Delivery Address",
        // message:
        //   "Please ",
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
      .then(successAlertEl => {
        successAlertEl.present();
      });
  }

  failureCurrentUsedAddressChange() {
    this.failureAlertCtrl
      .create({
        header: "Oops... Something went wrong",
        message: "Please try again to select the new delivery address",
        //   "Please ",
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
      .then(failureAlertEl => {
        failureAlertEl.present();
      });
  }

  deleteAddressSuccessController(updatedCustomerProfileDoc) {
    this.deleteAddressSuccessAlertCtrl
      .create({
        header: "Successfully deleted the Address.",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              this.savedAddressesList = this.sortByService.sortCustomerAddress(
                updatedCustomerProfileDoc.customerAddressList
              );
            }
          }
        ]
      })
      .then(successAlertEl => {
        successAlertEl.present();
      });
  }

  deleteAddressFailureController() {
    this.deleteAddressFailAlertCtrl
      .create({
        header: "Oops... Something went wrong",
        message: "Please try again.",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {}
          }
        ]
      })
      .then(failureAlertEl => {
        failureAlertEl.present();
      });
  }
}
