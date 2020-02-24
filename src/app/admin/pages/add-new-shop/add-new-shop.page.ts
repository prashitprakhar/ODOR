import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
// import { AdminFunctionsService } from "../../services/admin-functions.service";
// import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
// import { IShopData } from "src/app/models/shop-data.model";
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
    // private adminFunctionsService: AdminFunctionsService,
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

    // const shopOfferedItems: IShopOfferedItems[] = [];

    // const shopProductsDetails: IShopData = {
    //   ...shopProfile,
    //   shopOfferedItems,
    //   shopAddress: shopAddressLineOne,
    //   shopPostalCode: shopPincode,
    //   shopLocation: shopAddressLineOne,
    //   shopImageUrl:
    //     "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
    // };

    // const createShopAccount = await
    this.shopAccountCreationProgressLoadingCtrl.create({
      message: 'Creating Shop Profile ...'
    }).then(loadingEl => {

      loadingEl.present();
  //     this.shopItemSelectionService.getProductDoc('ENTERPRISE_PARTNER_PRODUCTS', this.shopId.toString())
  //   .subscribe(newItemAdd => {
  //     const docId = newItemAdd.map(data => data.payload.doc.id);
  //     const doc = newItemAdd.map(element => element.payload.doc.data());
  //     const shopOfferedItems = doc[0]["shopOfferedItems"].filter(element => element.itemId !== this.product.itemId);
  //     doc[0]["shopOfferedItems"] = shopOfferedItems;
  //     doc[0]["shopOfferedItems"].push(updateItemDetails)
  //     this.shopItemSelectionService.updateDocument('ENTERPRISE_PARTNER_PRODUCTS', doc[0], docId[0])
  //     .subscribe(updatedDoc => {
  //       loadingEl.dismiss();
  //       this.editForm.reset();
  //       this.editItemDetailsModalCtrl.dismiss(null, "closed", "editItemDetailsModal");
  //     }, error => {
  //       console.log("Error Occured While Deleting Item");
  //     });
  // });
      // this.shopItemSelectionService.updateItemDetails(updateItemDetails).subscribe(data => {
      //   loadingEl.dismiss();
      //   this.editForm.reset();
      //   this.editItemDetailsModalCtrl.dismiss(null, "closed", "editItemDetailsModal");
      // });
    // });


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
        // console.log("shopProfile Created Successfully", shopProfileDetails);
        const createShopProfileSuccessMessage = `Shop Profile Created Successfully`;
        this.displaySuccessAlert(createShopProfileSuccessMessage);
      }, shopProfileCreationError => {
        this.adminShopFunctionsService.rollBackShopAccountCreation(shopId).then(shopAccountDeleted => {
          // console.log("Shop Account Deleted Successfully");
          const createShopProfileFailureMessage = `Couldn't create Shop Account. Please try again.`;
          this.displayFailureAlert(createShopProfileFailureMessage);
        }, shopAccountDeletionError => {
          // tslint:disable-next-line: max-line-length
          const shopAccountDeletionFailureMessage = `Couldn't Rollback shop account creation as few steps failed while creation. Please contact Support.`;
          this.displayFailureAlert(shopAccountDeletionFailureMessage);
        });
        // console.log("rollBackShopAccount rollBackShopAccount", rollBackShopAccount);
      });
    }, err => {
      // console.log("createShopProfile createShopProfile", err);
      const createAccountFailureMessage = `Couldn't create new Shop Account. Please try again.`;
      this.displayFailureAlert(createAccountFailureMessage);
    });
      loadingEl.dismiss();
      shopRegistrationForm.reset();
  });
    // console.log(
    //   "createShopAccount createShopAccount createShopAccount",
    //   createShopAccount
    // );
    // if (createShopAccount) {
    //           const shopId = createShopAccount.user._id;
    //           shopProfile = {
    //             ...shopProfile,
    //             shopId,
    //             userId: shopId
    //           };
    //           const createShopProfile = await this.adminShopFunctionsService.createShopProfile(shopProfile);
    //           if (createShopProfile) {
    //             console.log("createShopProfile createShopProfile", createShopProfile);
    //           } else {
    //             const rollBackShopAccount = await this.adminShopFunctionsService.rollBackShopAccountCreation(shopId);
    //             console.log("rollBackShopAccount rollBackShopAccount", rollBackShopAccount);
    //             const createShopProfileFailureMessage = `Couldn't create Shop Profile. Please try again.`;
    //             this.displayFailureAlert(createShopProfileFailureMessage);
    //           }
    //           console.log("createShopProfile createShopProfile", createShopProfile);
    //         }
    // else {
    //   console.log("createShopProfile createShopProfile", createShopProfile);
    //   const createAccountFailureMessage = `Couldn't create new Shop Account. Please try again.`;
    //   this.displayFailureAlert(createAccountFailureMessage);
    // }
    // const createShopProfile = await this.adminShopFunctionsService.createShopProfile()

    // this.adminFunctionsService.createShopAccount(email, shopName).subscribe(
    //   signupSuccessRes => {
    //     const shopSignupDetails = signupSuccessRes.user.toJSON();
    //     shopProfile = {
    //       ...shopProfile,
    //       shopId: shopSignupDetails["uid"],
    //       userId: shopSignupDetails["uid"]
    //     };
    //     this.adminFunctionsService
    //       .addShopProfile("USER_PROFILE", shopProfile)
    //       .subscribe(
    //         userProfileAddSuccessData => {
    //           shopRegistrationForm.reset();
    //           shopProductsDetails = {
    //             ...shopProductsDetails,
    //             shopId: shopSignupDetails["uid"],
    //             userId: shopSignupDetails["uid"]
    //           };
    //           this.adminFunctionsService
    //             .addShopProductsDoc(
    //               "ENTERPRISE_PARTNER_PRODUCTS",
    //               shopProductsDetails
    //             )
    //             .subscribe(
    //               shopProductsDocAddSuccess => {},
    //               shopProductsDocAddError => {
    //                 console.log(
    //                   " shopProductsDocAddError >>>>>>>",
    //                   shopProductsDocAddError
    //                 );
    //               }
    //             );
    //         },
    //         errorShopProfileAdd => {
    //           console.log("Error in Profile addition", errorShopProfileAdd);
    //         }
    //       );
    //   },
    //   signupError => {
    //     console.log("Signup Error Happened", signupError);
    //   }
    // );

    // this.adminFunctionsService.createShopAccount(email, shopName).subscribe(
    //   signupSuccessRes => {
    //     const shopSignupDetails = signupSuccessRes.user.toJSON();
    //     shopProfile = {
    //       ...shopProfile,
    //       shopId: shopSignupDetails["uid"],
    //       userId: shopSignupDetails["uid"]
    //     };
    //     this.adminFunctionsService
    //       .addShopProfile("USER_PROFILE", shopProfile)
    //       .subscribe(
    //         userProfileAddSuccessData => {
    //           shopRegistrationForm.reset();
    //           shopProductsDetails = {
    //             ...shopProductsDetails,
    //             shopId: shopSignupDetails["uid"],
    //             userId: shopSignupDetails["uid"]
    //           };
    //           this.adminFunctionsService
    //             .addShopProductsDoc(
    //               "ENTERPRISE_PARTNER_PRODUCTS",
    //               shopProductsDetails
    //             )
    //             .subscribe(
    //               shopProductsDocAddSuccess => {},
    //               shopProductsDocAddError => {
    //                 console.log(
    //                   " shopProductsDocAddError >>>>>>>",
    //                   shopProductsDocAddError
    //                 );
    //               }
    //             );
    //         },
    //         errorShopProfileAdd => {
    //           console.log("Error in Profile addition", errorShopProfileAdd);
    //         }
    //       );
    //   },
    //   signupError => {
    //     console.log("Signup Error Happened", signupError);
    //   }
    // );
  }

  displayFailureAlert(header) {
    const alert = this.failureAlertCtrl
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
                  // console.log("Shop is closed");
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
          .then(alertEl => {
            alertEl.present();
          });
  }
}
