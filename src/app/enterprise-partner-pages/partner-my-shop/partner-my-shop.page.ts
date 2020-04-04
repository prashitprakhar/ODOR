import { Component, OnInit, OnDestroy } from "@angular/core";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
// import { IShopList } from "src/app/models/shop-list.model";
import { IShopData } from "src/app/models/shop-data.model";
import { IShopOfferedItemsData } from "./../../models/shop-offered-items-data.model";
import { Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from "@capacitor/core";
import { Subscription } from "rxjs";
import {
  ModalController,
  IonItemSliding,
  AlertController
} from "@ionic/angular";
import { EditItemDetailsModalComponent } from "src/app/enterprise-partner-modals/edit-item-details-modal/edit-item-details-modal.component";
import { IShopProfile } from "src/app/models/shop-profile.model";
import { SortByService } from 'src/app/shared/utils/sort-by.service';
// import {
//   Plugins,
//   PushNotification,
//   PushNotificationToken,
//   PushNotificationActionPerformed
// } from "@capacitor/core";

import { Platform } from "@ionic/angular";

import { FCM } from "capacitor-fcm";
import { IUserMobileDetails } from 'src/app/models/user-mobile-details-model';
import { CommonUtilityService } from 'src/app/shared/services/common-utility.service';

const fcm = new FCM();

const { PushNotifications } = Plugins;
const { FCMPlugin } = Plugins;

@Component({
  selector: "app-partner-my-shop",
  templateUrl: "./partner-my-shop.page.html",
  styleUrls: ["./partner-my-shop.page.scss"]
})
export class PartnerMyShopPage implements OnInit, OnDestroy {
  public shopId: any;
  public shopDetails: IShopData[];
  public shopOfferedItemsList: IShopOfferedItems[] = [];
  public allShopListSubs: Subscription;
  public shopOfferedItemsSubs: Subscription;
  // New Functions
  public shopOfferedItemsData: IShopOfferedItemsData;
  public shopProfile: IShopProfile;
  public userMobileDetails: IUserMobileDetails;

  constructor(
    private shopItemSelectionService: ShopItemSelectionService,
    private editItemDetailsModalCtrl: ModalController,
    private confirmDeleteAlertCtrl: AlertController,
    private itemAvailabilirtAlertCtrl: AlertController,
    private sortByService: SortByService,
    private platform: Platform,
    private commonUtilityService: CommonUtilityService
  ) {}

  ngOnInit() {
    const userData = this.getStoredUserInfo();
    userData.then(data => {
      const userDataFetched = JSON.parse(data.value);
      this.shopId = userDataFetched.userId;
    });
  }

  ionViewWillEnter() {
    /*
     ** Push Notification Code Goes Here
     */
    // console.log("this.platform >>>>>>", this.platform.platforms());
      // if (this.platform.is("android")) {
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

      //   fcm
      //     .getToken()
      //     .then(async r => {
      //       // alert(`Token ${r.token}`)
      //       const userDetails = await Plugins.Storage.get({key: 'authData'});
      //       const userDetailsParsed = JSON.parse(userDetails.value);
      //       this.userMobileDetails = {
      //         userId: userDetailsParsed.userId,
      //         fcmToken: r.token
      //       };
      //       Plugins.Storage.set({
      //         key: "user_fcm_token",
      //         value: JSON.stringify(this.userMobileDetails)
      //       });

      //       this.commonUtilityService.setFCMToken(userDetailsParsed.userId, r.token, userDetailsParsed.token)
      //         .then(successfullyUpdateMobileDetail => {

      //         })
      //         .catch(err => {

      //         });

      //     })
      //     .catch(err => {
      //       Plugins.Storage.set({
      //         key: "user_fcm_token",
      //         value: null
      //       });
      //     });

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
  }

  getShopProfile(): Promise<IShopProfile> {
    return new Promise((resolve, reject) => {
      this.shopItemSelectionService
        .getShopProfile(this.shopId)
        .then(shopOfferedItem => {
          this.shopProfile = shopOfferedItem;
          resolve(this.shopProfile);
        })
        .catch(err => {
          reject(null);
        });
    });
  }

  getShopOfferedItemsList(): Promise<IShopOfferedItemsData> {
    return new Promise((resolve, reject) => {
      this.shopItemSelectionService
        .getShopOfferedItemsList(this.shopId)
        .then(shopOfferedItem => {
          this.shopOfferedItemsData = shopOfferedItem;
          this.shopOfferedItemsList = this.sortByService.sortArrayByItemName(shopOfferedItem.shopOfferedItemsList);
          resolve(this.shopOfferedItemsData);
        })
        .catch(err => {
          reject(null);
        });
    });
  }

  ionViewDidEnter() {
    Promise.all([this.getShopProfile(), this.getShopOfferedItemsList()])
      .then(data => {})
      .catch(err => {
        this.shopOfferedItemsData = {
          shopId: this.shopId,
          shopOfferedItemsList: []
        };
        this.shopProfile = null;
      });
  }

  ionViewDidLeave() {
    if (this.allShopListSubs) {
      this.allShopListSubs.unsubscribe();
    }
  }

  confirmItemDeletion(header, message, _id) {
    const alert = this.confirmDeleteAlertCtrl
      .create({
        header,
        message,
        //   "Please ",
        buttons: [
          {
            text: "No",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              // itemDetailsForm.reset();
            }
          },
          {
            text: "Yes",
            // role: "cancel",
            cssClass: "secondary",
            handler: () => {
              this.shopItemSelectionService
                .deteteShopItem(this.shopId.toString(), _id)
                .then(data => {
                  console.log("Deteled Item from Shop", data);
                  Promise.all([
                    this.getShopProfile(),
                    this.getShopOfferedItemsList()
                  ])
                    .then(data => {})
                    .catch(err => {
                      this.shopOfferedItemsData = {
                        shopId: this.shopId,
                        shopOfferedItemsList: []
                      };
                      this.shopProfile = null;
                    });
                })
                .catch(err => {
                  console.log("Error Occured while deleting ***", err);
                });
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  deleteItem(_id) {
    const header = "Delete Item";
    const message = "Are you sure to delete the Item ?";
    this.confirmItemDeletion(header, message, _id);
  }

  editItemDetails(item, editEl: IonItemSliding) {
    editEl.close();
    this.editItemDetailsModalCtrl
      .create({
        component: EditItemDetailsModalComponent,
        componentProps: {
          name: "editItemDetailsModal",
          selectedShopId: this.shopId,
          product: item
        },
        id: "editItemDetailsModal"
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(data => {
        Promise.all([this.getShopProfile(), this.getShopOfferedItemsList()])
          .then(data => {})
          .catch(err => {
            this.shopOfferedItemsData = {
              shopId: this.shopId,
              shopOfferedItemsList: []
            };
            this.shopProfile = null;
          });
      });
  }

  ngOnDestroy() {
    if (this.allShopListSubs) {
      this.allShopListSubs.unsubscribe();
    }
    if (this.shopOfferedItemsSubs) {
      this.shopOfferedItemsSubs.unsubscribe();
    }
  }

  setAvailability(item) {
    const _id = item._id;
    // console.log("Item Id", item);
    this.shopItemSelectionService.setItemAvailability(this.shopId.toString(), item._id).then(data => {
      Promise.all([this.getShopProfile(), this.getShopOfferedItemsList()])
      .then(data => {})
      .catch(err => {
        this.shopOfferedItemsData = {
          shopId: this.shopId,
          shopOfferedItemsList: []
        };
        this.shopProfile = null;
      });
    })
    .catch(err => {
      this.failureInUpdate();
    });
  }

  failureInUpdate(header = "Item Availability update Failed.", message = "Oops.. Something went wrong. Please try again.") {
    const alert = this.confirmDeleteAlertCtrl
      .create({
        header,
        message,
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

  async getStorageData(): Promise<any> {
    const shopId = await Plugins.Storage.get({ key: "shopId" });
    return shopId;
  }

  async getStoredUserInfo(): Promise<any> {
    const userData = await Plugins.Storage.get({ key: "authData" });
    return userData;
  }

  setShopOpenCloseStatus(shopDetails) {
    this.shopItemSelectionService.setShopOpeStatus(this.shopId.toString()).then(data => {
      Promise.all([this.getShopProfile(), this.getShopOfferedItemsList()])
      .then(data => {})
      .catch(err => {
        this.shopOfferedItemsData = {
          shopId: this.shopId,
          shopOfferedItemsList: []
        };
        this.shopProfile = null;
      });
    })
    .catch(err => {
      const header = "Shop Profile Update Failed.";
      const message = "Oops.. Something went wrong. Please try again."
      this.failureInUpdate(header, message);
    })
    // this.shopItemSelectionService
    //   .getProductDoc("ENTERPRISE_PARTNER_PRODUCTS", this.shopId.toString())
    //   .subscribe(newItemAdd => {
    //     const docId = newItemAdd.map(data => data.payload.doc.id);
    //     const doc = newItemAdd.map(element => element.payload.doc.data());
    //     doc[0]["isShopOpen"] = !doc[0]["isShopOpen"];
    //     this.shopItemSelectionService
    //       .updateDocument("ENTERPRISE_PARTNER_PRODUCTS", doc[0], docId[0])
    //       .subscribe(
    //         updatedDoc => {},
    //         error => {
    //           console.log("Error Occured While Deleting Item");
    //         }
    //       );
    //   });
  }
}
