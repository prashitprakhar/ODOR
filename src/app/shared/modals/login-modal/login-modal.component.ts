import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  LoadingController,
  ModalController,
  AlertController,
  ToastController,
  NavParams
} from "@ionic/angular";
import { Plugins } from "@capacitor/core";
import { Observable, Subscription } from "rxjs";
import { SignupModalComponent } from "../signup-modal/signup-modal.component";
import { SignupSuccessModalComponent } from "../signup-success-modal/signup-success-modal.component";
import { AuthenticationService } from "../../internal-services/authentication.service";
import { PasswordResetModalComponent } from "../password-reset-modal/password-reset-modal.component";
import { UserProfileService } from "src/app/services/user-profile.service";
import { CustomOrderService } from "src/app/services/custom-order.service";
import { CartUtilityService } from "src/app/utils/cart-utility.service";
import { MessageService } from "../../services/message.service";

@Component({
  selector: "app-login-modal",
  templateUrl: "./login-modal.component.html",
  styleUrls: ["./login-modal.component.scss"]
})
export class LoginModalComponent implements OnInit, OnDestroy {
  public authObjObservable: Observable<any>;
  public authObjObsSubs: Subscription;
  public navigationFrom: string;

  constructor(
    private loadingCtrl: LoadingController,
    private signupModalCtrl: ModalController,
    private alertCtrl: AlertController,
    private signupSuccessModalCtrl: ModalController,
    private loginSuccessToastCtrl: ToastController,
    private loginModalCtrl: ModalController,
    private authenticationService: AuthenticationService,
    private passwordResetModalCtrl: ModalController,
    private navParams: NavParams,
    private userProfileService: UserProfileService,
    private customOrderService: CustomOrderService,
    private cartUtilityService: CartUtilityService,
    private messageService: MessageService
  ) {
    this.navigationFrom = navParams.get("navigationFrom");
  }

  ngOnInit() {}

  onClose(dataRole: string = "closed") {
    this.loginModalCtrl.dismiss(null, dataRole, "loginModal");
  }

  onCloseLoginSuccess(userRole) {
    this.loginModalCtrl.dismiss(userRole, "LOGIN_SUCCESS", "loginModal");
  }

  ngOnDestroy() {
    if (this.authObjObsSubs) {
      this.authObjObsSubs.unsubscribe();
    }
  }

  setUserProfileData() {
    this.userProfileService.getAndSetCustomerProfile();
  }

  checkAndUpdateCartItemsInDB(dbCartData) {
    console.log("dbCartData", dbCartData);
    if (dbCartData) {
    }
  }

  async onLogin(loginForm: NgForm) {
    if (!loginForm.valid) {
      return;
    }
    const email = loginForm.value.email;
    const password = loginForm.value.password;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Logging in..." })
      .then(async loadingEl => {
        loadingEl.present();
        this.authObjObservable = this.authenticationService.login(
          email,
          password
        );
        this.authObjObsSubs = this.authObjObservable.subscribe(
          async loginResData => {
            const userAuthInfo = loginResData["user"];
            const userRole = userAuthInfo["role"];
            if (this.navigationFrom && this.navigationFrom === "CART") {
              this.setUserProfileData();
              const selectableItems = this.customOrderService
                .selectableItemsOrders;
              const customPackItems = this.customOrderService
                .customItemsPacksOrdersDetails;
              const customKGItems = this.customOrderService
                .customItemOrdersDetails;
              this.userProfileService
                .updateDBWithCurrentCartItems(
                  selectableItems,
                  customPackItems,
                  customKGItems
                )
                .then(async data => {
                  // console.log("11111111111", data);
                  if (data.message === "SUCCESS") {
                    await loadingEl.dismiss();
                    this.onClose();
                  }
                })
                .catch(async e => {
                  await loadingEl.dismiss();
                  this.onClose("CART_UPDATE_FAILURE");
                });
            } else if (userRole === "ENTERPRISE_PARTNER") {
              await loadingEl.dismiss();
              this.loginSuccessToastControllerMessage();
              this.onCloseLoginSuccess("ENTERPRISE_PARTNER");
            } else if (userRole === "GENERAL_ADMIN") {
              await loadingEl.dismiss();
              this.loginSuccessToastControllerMessage();
              this.onCloseLoginSuccess("GENERAL_ADMIN");
            } else {
              await this.authObjObsSubs.unsubscribe();
              this.setUserProfileData();
              // add Local Storage Cart Items Check Here
              if (this.cartUtilityService.hasLocalStorageCartItems()) {
                this.cartUtilityService
                  .onLoginUpdateDBCartsWhenLocalStorageItemsAvailable()
                  .then(updatedResponse => {
                    console.log(
                      "updatedResponse updatedResponse :::::::",
                      updatedResponse
                    );
                  })
                  .catch(errResponse => {
                    console.log("Error Response When DB Update");
                  });
              } else {
                this.userProfileService
                  .getInitialCartItemsFromDB()
                  .then(async dbCartItemsRes => {
                    // console.log("dbCartItemsRes dbCartItemsRes - No Local Cart Item ::::", dbCartItemsRes);
                    // this.customOrderService.selectableItemsOrders = dbCartItemsRes.selectableItems.selectableItemsList;
                    // check if the items added in cart previously are currently available or not
                    this.customOrderService.selectableItemsOrders =
                      await this.cartUtilityService.updateSelectableItemsAsPerAvailabilityCurrently(
                      dbCartItemsRes.selectableItems.selectableItemsList
                    );
                    this.customOrderService.customItemOrdersDetails =
                      dbCartItemsRes.customItemsKG.customKGItemList;
                    this.customOrderService.customItemsPacksOrdersDetails =
                      dbCartItemsRes.customItemsPacks.customPackItemList;
                    if (this.cartUtilityService.hasLocalStorageCartItems()) {
                      // this.messa
                      this.messageService.sendMessage("ITEM_ADDED_IN_CART");
                    }
                  })
                  .catch(errDBCartItemRes => {
                    console.log(
                      "errDBCartItemRes errDBCartItemRes - No Local Cart Items Error ::::",
                      errDBCartItemRes
                    );
                  });
              }
              // this.userProfileService.getInitialCartItemsFromDB();

              await loadingEl.dismiss();
              this.loginSuccessToastControllerMessage();
              this.onCloseLoginSuccess("CUSTOMER");
            }
          },
          errorFetchingUserProfile => {
            loadingEl.dismiss();
            let errorMessage = "";
            let errorHeader = "";
            errorMessage = "Something went wrong. Please try again.";
            errorHeader = "OOPS...";
            this.genericErrorAlertMessage(errorHeader, errorMessage, loginForm);
          }
        );
        loginForm.reset();
      });
  }

  async loginSuccessToastControllerMessage() {
    const authData = Plugins.Storage.get({ key: "authData" });
    authData.then(async data => {
      const loginDetails = JSON.parse(data.value);
      const loginSuccessToast = await this.loginSuccessToastCtrl.create({
        message: `Successfully logged in as ${loginDetails.email}`,
        duration: 1500,
        position: "bottom",
        color: "success"
      });
      loginSuccessToast.present();
    });
  }

  emailNotFoundErrorAlertMessage(headerLabel, errorMessage, loginForm: NgForm) {
    this.alertCtrl
      .create({
        header: headerLabel,
        message: errorMessage,
        buttons: [
          {
            text: "OK",
            handler: () => {
              loginForm.reset();
              this.signup();
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  genericErrorAlertMessage(headerLabel, errorMessage, loginForm: NgForm) {
    this.alertCtrl
      .create({
        header: headerLabel,
        message: errorMessage,
        buttons: [
          {
            text: "OK",
            handler: () => {}
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  incorrectPasswordErrorAlertMessage(
    headerLabel,
    errorMessage,
    loginForm: NgForm
  ) {
    this.alertCtrl
      .create({
        header: headerLabel,
        message: errorMessage,
        buttons: [
          {
            text: "OK",
            handler: () => {}
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
  }

  signupSuccess() {
    // this.signupSuccessModalCtrl
    //   .create({
    //     component: SignupSuccessModalComponent,
    //     id: "signupSuccessModal"
    //   })
    //   .then(signupSuccessModalEl => {
    //     signupSuccessModalEl.present();
    //     return signupSuccessModalEl.onDidDismiss();
    //   });
  }

  signup() {
    this.signupModalCtrl
      .create({
        component: SignupModalComponent,
        id: "signupModal"
      })
      .then(signupModalEl => {
        signupModalEl.present();
        return signupModalEl.onDidDismiss();
      })
      .then(data => {
        if (data.role !== "ALL_READY_MEMBER") {
          this.signupSuccessModalCtrl
            .create({
              component: SignupSuccessModalComponent,
              id: "signupSuccessModal"
            })
            .then(signupSuccessModalEl => {
              signupSuccessModalEl.present();
              return signupSuccessModalEl.onDidDismiss();
            });
        }
      });
  }

  passwordReset() {
    this.passwordResetModalCtrl
      .create({
        component: PasswordResetModalComponent,
        id: "passwordResetModal"
      })
      .then(passwordResetModalEl => {
        passwordResetModalEl.present();
        return passwordResetModalEl.onDidDismiss();
      })
      .then(data => {});
  }
}
