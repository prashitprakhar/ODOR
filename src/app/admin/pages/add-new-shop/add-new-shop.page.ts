import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AdminShopFunctionsService } from "../../services/admin-shop-functions.service";
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: "app-add-new-shop",
  templateUrl: "./add-new-shop.page.html",
  styleUrls: ["./add-new-shop.page.scss"]
})
export class AddNewShopPage implements OnInit {
  private defaultPassword: string = "11111111";

  constructor(
    private adminShopFunctionsService: AdminShopFunctionsService,
    private failureAlertCtrl: AlertController,
    private shopAccountCreationProgressLoadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async onSubmit(shopRegistrationForm: NgForm) {
    if (!shopRegistrationForm.valid) {
      return;
    }

    const email = shopRegistrationForm.value.email;
    const shopName = shopRegistrationForm.value.shopName;
    const shopAddressLineOne = shopRegistrationForm.value.shopAddressLineOne;
    const shopAddressLineTwo = shopRegistrationForm.value.shopAddressLineTwo;
    const shopPincode = shopRegistrationForm.value.shopPincode;
    const shopCity = shopRegistrationForm.value.shopCity;
    const shopState = shopRegistrationForm.value.shopState;
    const shopMobileNumber = shopRegistrationForm.value.shopMobileNumber;
    const role = "ENTERPRISE_PARTNER";
    const securePIN = '111111';
    const username = shopRegistrationForm.value.email;

    let shopProfile = {
      email,
      shopName,
      shopAddressLineOne,
      shopAddressLineTwo,
      shopPincode,
      shopCity,
      shopState,
      shopMobileNumber,
      role,
      shopType: "GROCERY",
      shopId: "",
      shopRating: 4.5,
      userId: "",
      firstOrderTime: "7 AM",
      lastOrderTime: "10 PM",
      isShopOpen: true,
      shopImageUrl:
        "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
    };

    this.shopAccountCreationProgressLoadingCtrl.create({
      message: 'Creating Shop Profile ...'
    }).then(loadingEl => {

      loadingEl.present();

      this.adminShopFunctionsService.createNewShopAccount(
      email,
      this.defaultPassword,
      role,
      username,
      securePIN
    ).then(shopAccount => {
      const shopId = shopAccount.user._id;
      shopProfile = {
        ...shopProfile,
        shopId,
        userId: shopId
      };
      this.adminShopFunctionsService.createShopProfile(shopProfile).then(shopProfileDetails => {
        const createShopProfileSuccessMessage = `Shop Profile Created Successfully`;
        this.displaySuccessAlert(createShopProfileSuccessMessage);
      }, shopProfileCreationError => {
        this.adminShopFunctionsService.rollBackShopAccountCreation(shopId).then(shopAccountDeleted => {
          const createShopProfileFailureMessage = `Couldn't create Shop Account. Please try again.`;
          this.displayFailureAlert(createShopProfileFailureMessage);
        }, shopAccountDeletionError => {
          // tslint:disable-next-line: max-line-length
          const shopAccountDeletionFailureMessage = `Couldn't Rollback shop account creation as few steps failed while creation. Please contact Support.`;
          this.displayFailureAlert(shopAccountDeletionFailureMessage);
        });
      });
    }, err => {
      const createAccountFailureMessage = `Couldn't create new Shop Account. Please try again.`;
      this.displayFailureAlert(createAccountFailureMessage);
    });
      loadingEl.dismiss();
      shopRegistrationForm.reset();
  });
  }

  displayFailureAlert(header) {
    const alert = this.failureAlertCtrl
          .create({
            header,
            buttons: [
              {
                text: "OK",
                role: "cancel",
                cssClass: "secondary",
                handler: cancel => {
                }
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
  }

  displaySuccessAlert(header) {
    const alert = this.failureAlertCtrl
          .create({
            header,
            buttons: [
              {
                text: "OK",
                role: "cancel",
                cssClass: "secondary",
                handler: cancel => {
                }
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
  }
}
