import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { AllMyOrdersModalComponent } from "src/app/modals/all-my-orders-modal/all-my-orders-modal.component";
import { LoginModalComponent } from "src/app/shared/modals/login-modal/login-modal.component";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/app/shared/internal-services/authentication.service";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { UpdateUserProfileModalComponent } from "src/app/modals/update-user-profile-modal/update-user-profile-modal.component";
import { ViewSavedAddressesModalComponent } from "src/app/modals/view-saved-addresses-modal/view-saved-addresses-modal.component";
import { AddNewAddressModalComponent } from "src/app/modals/add-new-address-modal/add-new-address-modal.component";
import { UserProfileService } from "src/app/services/user-profile.service";
import { CustomOrderService } from "src/app/services/custom-order.service";

@Component({
  selector: "app-account-details",
  templateUrl: "./account-details.page.html",
  styleUrls: ["./account-details.page.scss"]
})
export class AccountDetailsPage implements OnInit, OnDestroy {
  public userProfile: any = {};
  public isUserLoggedIn: boolean = false;
  private authStateSubs: Subscription;
  public deviceFCMToken: string;

  constructor(
    private router: Router,
    private allOrdersModalCtrl: ModalController,
    private updateProfileModalCtrl: ModalController,
    private loginModalCtrl: ModalController,
    private authenticationService: AuthenticationService,
    private shopItemSelectionService: ShopItemSelectionService,
    private viewSavedAddressesModalCtrl: ModalController,
    private addNewAddressModalCtrl: ModalController,
    private userProfileService: UserProfileService,
    private customOrdersService: CustomOrderService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }

  ionViewDidEnter() {
    this.authStateSubs = this.authenticationService.userAuthState.subscribe(
      userAuthState => {
        if (!userAuthState || !userAuthState.value) {
          this.isUserLoggedIn = false;
          this.showLoginSignupScreen();
        } else {
          const parsedAuthData = JSON.parse(userAuthState.value) as {
            token: string;
            userId: string;
            tokenExpirationDate: string;
            email: string;
            username: string;
          };
          this.userProfile.email = parsedAuthData.email;
          this.isUserLoggedIn = true;
        }
      }
    );
    this.shopItemSelectionService.getDeviceFCMToken().then(deviceFCMToken => {
      this.deviceFCMToken = deviceFCMToken;
    });
  }

  ionViewDidLeave() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }

  viewSavedAddresses() {
    this.viewSavedAddressesModalCtrl
      .create({
        component: ViewSavedAddressesModalComponent,
        id: "viewSavedAddressesModal"
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

  updateExistingAddress() {}

  updateSecurePIN() {}

  onLogout() {
    this.userProfileService.updateSelectableItemsInDB(
      this.customOrdersService.selectableItemsOrders
    ).then(successResponse => {

    })
    .catch(errorResopnse => {

    });
    const customCartUpdateInDB = this.userProfileService.updateCustomItemsOrderInDB(
      this.customOrdersService.customItemOrdersDetails,
      this.customOrdersService.customItemsPacksOrdersDetails
    ).then(successResponse => {

    })
    .catch(errorResponse => {

    });
    // console.log("customCartUpdateInDB", customCartUpdateInDB);
    // console.log("selectableCartUpdateInDB", selectableCartUpdateInDB);
    this.authenticationService.logout();
  }

  showLoginSignupScreen() {
    this.loginModalCtrl
      .create({
        component: LoginModalComponent,
        id: "loginModal"
      })
      .then(loginModalEl => {
        loginModalEl.present();
        return loginModalEl.onDidDismiss();
      })
      .then(data => {
        if (data.role === "LOGIN_SUCCESS") {
          if (data.data === "ENTERPRISE_PARTNER") {
            this.router.navigateByUrl("/partnerHomePage/partnerTabs");
          } else if (data.data === "GENERAL_ADMIN") {
            this.router.navigateByUrl("/adminHomePage/adminTab");
          } else if (data.data === "CUSTOMER") {
            this.router.navigateByUrl("/homepage/tabs");
          }
        } else {
          this.router.navigateByUrl("/homepage/tabs");
        }
      });
  }

  myAllOrders() {
    this.allOrdersModalCtrl
      .create({
        component: AllMyOrdersModalComponent,
        id: "allOrdersModal"
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(data => {});
  }

  updateUserProfile() {
    console.log("Update Profile clicked ***");
    this.updateProfileModalCtrl
      .create({
        component: UpdateUserProfileModalComponent,
        id: "userProfileUpdateModal"
      })
      .then(profileUpdateEl => {
        profileUpdateEl.present();
        return profileUpdateEl.onDidDismiss();
      })
      .then(data => {});
  }
}

// IONIC Default Package Name io.ionic.starter
// IONIC NEW Package Name com.orderitservices.orderit
// capacitor.config.xml - Default --- com.odor.ionic
// capacitor.config.xml - New --- com.orderitservices.orderit
/*
in Build.gradle <project>/build.gradle
buildscript {
  repositories {
    // Check that you have the following line (if not, add it):
    google()  // Google's Maven repository
  }
  dependencies {
    ...
    // Add this line
    classpath 'com.google.gms:google-services:4.3.3'
  }
}

allprojects {
  ...
  repositories {
    // Check that you have the following line (if not, add it):
    google()  // Google's Maven repository
    ...
  }
}

<project>/<app-module>/build.gradle



apply plugin: 'com.android.application'
// Add this line
apply plugin: 'com.google.gms.google-services'

dependencies {
  // add the Firebase SDK for Google Analytics
  implementation 'com.google.firebase:firebase-analytics:17.2.2'
  // add SDKs for any other desired Firebase products
  // https://firebase.google.com/docs/android/setup#available-libraries
}

// then Sync

*/
