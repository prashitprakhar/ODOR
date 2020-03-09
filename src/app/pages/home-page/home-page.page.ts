import { Component, OnInit, OnDestroy } from "@angular/core";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { Subscription } from "rxjs";
import { MessageService } from "./../../shared/services/message.service";
import { CustomOrderService } from "src/app/services/custom-order.service";
// import { IShopData } from 'src/app/models/shop-data.model';
import { CurrentShopProfileService } from "src/app/shared/internal-services/current-shop-profile.service";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from "@capacitor/core";
import { Platform } from "@ionic/angular";

import { FCM } from "capacitor-fcm";
import { AuthenticationService } from 'src/app/shared/internal-services/authentication.service';
import { UserProfileService } from 'src/app/services/user-profile.service';
// import { FCM } from '@ionic-native/fcm/ngx';
const fcm = new FCM();

const { PushNotifications } = Plugins;
const { FCMPlugin } = Plugins;

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.page.html",
  styleUrls: ["./home-page.page.scss"]
})
export class HomePagePage implements OnInit, OnDestroy {
  // Important command for live reloading on android device
  // ionic capacitor run android -l
  public allShopListSubs: Subscription;
  public message: any;
  public isItemSelected: boolean = false;
  public shopIdFromSavedCartItems: string;

  constructor(
    private shopItemSelectionService: ShopItemSelectionService,
    private messageService: MessageService,
    private customOrderService: CustomOrderService,
    private currentShopProfileService: CurrentShopProfileService,
    private platform: Platform,
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService
  ) {
    if (this.customOrderService.selectableItemsOrders) {
      if (this.customOrderService.selectableItemsOrders.length > 0) {
        this.isItemSelected = true;
        // console.log("Cam in if statement");
      } else {
        this.isItemSelected = false;
      }
    }

    // Clear the Local Storage for Login on First time Install
    // Need to put this somewhere else so that this happens only when the application is installed first time
    // Currently un comment this when testing on Mobile
    this.authenticationService.clearLoginDetailsLocalStorage();
    this.userProfileService.removeCustomerProfileFromLocalStorage();

    // this.allShopListSubs = this.messageService
    //   .getMessage()
    //   .subscribe(message => {
    //     // console.log("message message message", message);
    //     this.message = message;
    //     if (
    //       this.customOrderService.selectableItemsOrders.length > 0 ||
    //       this.customOrderService.customItemsPacksOrdersDetails.length ||
    //       this.customOrderService.customItemOrdersDetails.length
    //     ) {
    //       this.isItemSelected = true;
    //     } else {
    //       this.isItemSelected = false;
    //     }
    //   });
  }

  ngOnInit() {
    this.messageService.getCartEmptyAfterOrderPlacedStatus().subscribe(data => {
      // console.log("Data for cart status Arrived", data);
      if (data) {
        if (data.cartStatus === "CART_EMPTY") {
          this.isItemSelected = false;
          this.messageService.clearCartStatusAfterOrderPlaced();
        }
      }
    });
    /*
     ** Push Notification Code Goes Here
     */
    // console.log("this.platform >>>>>>", this.platform.platforms());
    //   if (this.platform.is('android')) {
    //   // fcm.deleteInstance();
    //   PushNotifications.register();

    //   PushNotifications.addListener(
    //     "registration",
    //     (token: PushNotificationToken) => {
    //       // alert("Push registration success, token: " + token.value);
    //     }
    //   );

    //   PushNotifications.addListener("registrationError", (error: any) => {
    //     // alert("Error on registration: " + JSON.stringify(error));
    //   });

    //   fcm.getToken()
    //   .then(r => {
    //     // alert(`Token ${r.token}`)
    //     Plugins.Storage.set({
    //       key: "user_fcm_token",
    //       value: JSON.stringify(r.token)
    //     });
    //   })
    //   .catch(err => {
    //     Plugins.Storage.set({
    //       key: "user_fcm_token",
    //       value: null
    //     });
    //   });

    //   PushNotifications.addListener(
    //     "pushNotificationReceived",
    //     (notification: PushNotification) => {
    //       // alert("Push received: " + JSON.stringify(notification));
    //     }
    //   );

    //   PushNotifications.addListener(
    //     "pushNotificationActionPerformed",
    //     (notification: PushNotificationActionPerformed) => {
    //       // alert("Push action performed: " + JSON.stringify(notification));
    //     }
    //   );
    // }
    /*
     ** Push Notification Code till here
     */
    this.shopItemSelectionService
      .getOrderedItemsFromLocalStorage()
      .subscribe(localStorageItemsSaved => {
        const localStorageCartDataParsed = JSON.parse(
          localStorageItemsSaved.value
        );
        if (localStorageCartDataParsed) {
          if (localStorageCartDataParsed.selectableItems.length > 0) {
            this.shopIdFromSavedCartItems =
              localStorageCartDataParsed.selectableItems[0].shopId;
            this.shopItemSelectionService
              .getShopProfileForCustomers(this.shopIdFromSavedCartItems)
              .then(shopProfile => {
                this.currentShopProfileService.currentShopProfile = shopProfile;
              });
          } else if (localStorageCartDataParsed.customItemsKG.length) {
            this.shopIdFromSavedCartItems =
              localStorageCartDataParsed.customItemsKG[0].shopId;
            this.shopItemSelectionService
              .getShopProfileForCustomers(this.shopIdFromSavedCartItems)
              .then(shopProfile => {
                this.currentShopProfileService.currentShopProfile = shopProfile;
              });
          } else if (localStorageCartDataParsed.customItemsPacks.length) {
            this.shopIdFromSavedCartItems =
              localStorageCartDataParsed.customItemsPacks[0].shopId;
            this.shopItemSelectionService
              .getShopProfileForCustomers(this.shopIdFromSavedCartItems)
              .then(shopProfile => {
                this.currentShopProfileService.currentShopProfile = shopProfile;
              });
          } else {
            this.shopIdFromSavedCartItems = "";
            this.currentShopProfileService.currentShopProfile = null;
          }
        } else {
          this.shopItemSelectionService.addOrderedItemsToLocalStorage(
            [],
            [],
            []
          );
          this.shopIdFromSavedCartItems = "";
          this.currentShopProfileService.currentShopProfile = null;
        }
      });
    this.allShopListSubs = this.messageService
      .getMessage()
      .subscribe(message => {
        // console.log("message message message", message);
        this.message = message;
        if (this.customOrderService.selectableItemsOrders) {
          this.customOrderService.selectableItemsOrders.length > 0 ? this.isItemSelected = true : this.isItemSelected = false;
        }
        // else {

        // }
        if (this.customOrderService.customItemsPacksOrdersDetails) {
          // tslint:disable-next-line: max-line-length
          this.customOrderService.customItemsPacksOrdersDetails.length > 0 ? this.isItemSelected = true : this.isItemSelected = this.isItemSelected || false;
         }

        if (this.customOrderService.customItemOrdersDetails) {
          // tslint:disable-next-line: max-line-length
          this.customOrderService.customItemOrdersDetails.length > 0 ? this.isItemSelected = true : this.isItemSelected = this.isItemSelected || false;
         }
        // if (
        //   this.customOrderService.selectableItemsOrders.length > 0 ||
        //   this.customOrderService.customItemsPacksOrdersDetails.length ||
        //   this.customOrderService.customItemOrdersDetails.length
        // ) {
        //   this.isItemSelected = true;
        // } else {
        //   this.isItemSelected = false;
        // }
      });
  }

  clearMessage(): void {
    this.messageService.clearMessage();
  }

  ngOnDestroy() {
    if (this.allShopListSubs) {
      this.allShopListSubs.unsubscribe();
    }
  }
}
