import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  AlertController,
  IonItemSliding,
  ModalController,
  NavParams,
  LoadingController
} from "@ionic/angular";
import { Subscription } from "rxjs";
import { CustomOrderService } from "src/app/services/custom-order.service";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { UserProfileService } from "src/app/services/user-profile.service";
import { ICustomOrderItem } from "./../../models/custom-order-items.model";
import { MessageService } from "src/app/shared/services/message.service";
import { AuthenticationService } from "src/app/shared/internal-services/authentication.service";
// import { ModalController, AlertController } from "@ionic/angular";

@Component({
  selector: "app-custom-order-modal",
  templateUrl: "./custom-order-modal.component.html",
  styleUrls: ["./custom-order-modal.component.scss"]
})
export class CustomOrderModalComponent implements OnInit, OnDestroy {
  public selectedShopId: string;

  public customItemsCount: number = 0;

  // public otherCustomOrderInCartMessage: string = 'You have custom orders for other shop. Do you want to remove those and continu'
  public customKilogramItemsArray: ICustomOrderItem[] = [];

  public customPacketsItemsArray: ICustomOrderItem[] = [];
  public shopName: string;
  public shopOfferedItemsSubs: Subscription;
  public userOrdersFromLocalStorageSubs: Subscription;
  public customPacketsItemsArrayFromLocalStorage: ICustomOrderItem[] = [];
  public customKilogramItemsArrayFromLocalStorage: ICustomOrderItem[] = [];

  constructor(
    private modalCtrl: ModalController,
    private customOrderService: CustomOrderService,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private userProfileService: UserProfileService,
    private shopItemSelectionService: ShopItemSelectionService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private savingCartDetailsLoadingCtrl: LoadingController,
    private customItemsAddToCartSuccessAlertCtrl: AlertController,
    private customItemsAddToCartFailAlertCtrl: AlertController
  ) {
    this.selectedShopId = navParams.get("selectedShopId");
    this.shopItemSelectionService
      .getCurrentShopProfileSelected()
      .then(shopProfile => {
        this.shopName = shopProfile.shopName;
        const uniqueIdKG = this.authenticationService.getUniqueObjectId();
        const uniqueIdPack = this.authenticationService.getUniqueObjectId();
        this.customKilogramItemsArray = [
          {
            shopId: this.selectedShopId,
            shopName: this.shopName,
            _id: uniqueIdKG,
            itemId: uniqueIdKG,
            itemName: "",
            itemCount: 0,
            itemUnit: "KG",
            totalPrice: 0,
            itemDiscountedRate: 0,
            itemWeight: 0,
            orderType: "CUSTOM"
          }
        ];

        this.customPacketsItemsArray = [
          {
            shopId: this.selectedShopId,
            shopName: this.shopName,
            _id: uniqueIdPack,
            itemId: uniqueIdPack,
            itemName: "",
            itemCount: 0,
            itemUnit: "PACK",
            totalPrice: 0,
            itemDiscountedRate: 0,
            itemWeight: 0,
            orderType: "CUSTOM"
          }
        ];
      });
  }

  ngOnInit() {
    if (
      (this.userProfileService.getUserOrder() &&
        this.customOrderService.customItemsPacksOrdersDetails &&
        this.customOrderService.customItemsPacksOrdersDetails.length > 0 &&
        this.customOrderService.customItemsPacksOrdersDetails[0].shopId !==
          this.selectedShopId) ||
      (this.customOrderService.customItemOrdersDetails &&
        this.customOrderService.customItemOrdersDetails.length > 0 &&
        this.customOrderService.customItemOrdersDetails[0].shopId !==
          this.selectedShopId) ||
      (this.customOrderService.selectableItemsOrders &&
        this.customOrderService.selectableItemsOrders.length > 0 &&
        this.customOrderService.selectableItemsOrders[0].shopId !==
          this.selectedShopId)
    ) {
      this.alertCtrl
        .create({
          header: "Items already in cart",
          message:
            "Your cart contains items from a different Shop. Would you like to reset your cart and add items from this shop ?",
          buttons: [
            {
              text: "No",
              role: "cancel",
              cssClass: "secondary",
              handler: cancel => {
                this.modalCtrl.dismiss(null, "closed", "customItemModal");
              }
            },
            {
              text: "Yes",
              handler: () => {
                this.customOrderService.customItemOrdersDetails = [];
                this.customOrderService.customItemsPacksOrdersDetails = [];
                this.customOrderService.selectableItemsOrders = [];
                this.customOrderService.isResetAllOrdersNeeded = true;
              }
            }
          ]
        })
        .then(alertEl => {
          alertEl.present();
        });
    }
    this.userOrdersFromLocalStorageSubs = this.shopItemSelectionService
      .getOrderedItemsFromLocalStorage()
      .subscribe(localStorageUserCustomSelections => {
        const customItemsFromLocalStorageKG = JSON.parse(
          localStorageUserCustomSelections.value
        ).customItemsKG;
        const customItemsFromLocalStoragePack = JSON.parse(
          localStorageUserCustomSelections.value
        ).customItemsPacks;
        this.customPacketsItemsArrayFromLocalStorage =
          customItemsFromLocalStoragePack &&
          customItemsFromLocalStoragePack.length > 0
            ? customItemsFromLocalStoragePack.filter(
                element => element.itemUnit === "PACK"
              )
            : [];
        this.customKilogramItemsArrayFromLocalStorage =
          customItemsFromLocalStorageKG &&
          customItemsFromLocalStorageKG.length > 0
            ? customItemsFromLocalStorageKG.filter(
                element => element.itemUnit === "KG"
              )
            : [];
      });

    this.customKilogramItemsArray =
      this.customOrderService.customItemOrdersDetails &&
      this.customOrderService.customItemOrdersDetails.length > 0
        ? this.customOrderService.customItemOrdersDetails[0].shopId !==
          this.selectedShopId
          ? this.customKilogramItemsArray
          : this.customOrderService.customItemOrdersDetails
        : this.customKilogramItemsArray;

    this.customPacketsItemsArray =
      this.customOrderService.customItemsPacksOrdersDetails &&
      this.customOrderService.customItemsPacksOrdersDetails.length > 0
        ? this.customOrderService.customItemsPacksOrdersDetails[0].shopId !==
          this.selectedShopId
          ? this.customPacketsItemsArray
          : this.customOrderService.customItemsPacksOrdersDetails
        : this.customPacketsItemsArray;

    // Pushing local stored Items to custom KG items Array
    if (this.customKilogramItemsArray.length > 0) {
      if (this.customKilogramItemsArrayFromLocalStorage.length > 0) {
        this.customKilogramItemsArrayFromLocalStorage.forEach(eachKGItem => {
          const kgItemStored = this.customKilogramItemsArray.find(
            element => element._id === eachKGItem._id
          );
          if (kgItemStored) {
            kgItemStored.itemCount = eachKGItem.itemCount;
          } else {
            this.customKilogramItemsArray.push(eachKGItem);
          }
        });
      }
    } else {
      if (this.customKilogramItemsArrayFromLocalStorage.length > 0) {
        this.customKilogramItemsArray = this.customKilogramItemsArrayFromLocalStorage;
      }
    }
    // Pushing local stored Items to custom Pack items Array
    if (this.customPacketsItemsArray.length > 0) {
      if (this.customPacketsItemsArrayFromLocalStorage.length > 0) {
        this.customPacketsItemsArrayFromLocalStorage.forEach(eachKGItem => {
          const kgItemStored = this.customKilogramItemsArray.find(
            element => element._id === eachKGItem._id
          );
          if (kgItemStored) {
            kgItemStored.itemCount = eachKGItem.itemCount;
          } else {
            this.customKilogramItemsArray.push(eachKGItem);
          }
        });
      }
    } else {
      if (this.customPacketsItemsArrayFromLocalStorage.length > 0) {
        this.customKilogramItemsArray = this.customPacketsItemsArrayFromLocalStorage;
      }
    }
  }

  ngOnDestroy() {
    if (this.shopOfferedItemsSubs) {
      this.shopOfferedItemsSubs.unsubscribe();
    }
    if (this.userOrdersFromLocalStorageSubs) {
      this.userOrdersFromLocalStorageSubs.unsubscribe();
    }
  }

  onClose() {
    this.customKilogramItemsArray = this.customKilogramItemsArray.filter(
      element => element.itemName !== ""
    );
    this.customPacketsItemsArray = this.customPacketsItemsArray.filter(
      element => element.itemName !== ""
    );
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
    if (
      this.customKilogramItemsArray.length > 0 ||
      this.customPacketsItemsArray.length > 0
    ) {
      this.messageService.sendMessage("ITEM_ADDED_IN_CART");
      this.savingCartDetailsLoadingCtrl
        .create({
          message: "Adding to cart... Please wait..."
        })
        .then(loadingEl => {
          loadingEl.present();
          this.userProfileService
            .updateCustomItemsOrderInDB(
              this.customOrderService.customItemOrdersDetails,
              this.customOrderService.customItemsPacksOrdersDetails
            )
            .then(successResponse => {
              loadingEl.dismiss();
              this.modalCtrl.dismiss(null, "closed", "customItemModal");
            })
            .catch(errResponse => {
              loadingEl.dismiss();
              this.modalCtrl.dismiss(null, "closed", "customItemModal");
              // Removing this
              /*
              ** Reasons
              ** 1. We try saving Once
              ** 2. If Not saved, then already we try saving it at the time of Logging Out everything
              ** So this case will be covered under that
              ** If then also not saved, then there is slight chance that Cart item was not saved in DB
              ** And application Logged out
              ** and cart data lost
              ** We need to understand that DB is a backup basiacally for the cart items
              ** Most important part is the order part.
              ** At that time data loss should not occur
              ** there Exception handling needs to be robust
              */
              // const header = "Oops... Something went wrong";
              // const message =
              //   "Items couldn't be added to cart. please try again";
              // this.addToCartCustomOrderDetailsToCartFailure(header, message);
            });
        });
    } else {
      this.modalCtrl.dismiss(null, "CUSTOM_ORDER_CANCEL", "customItemModal");
    }
  }

  updateCustomCartItemInDB() {
    this.savingCartDetailsLoadingCtrl
        .create({
          message: "Adding to cart... Please wait..."
        })
        .then(loadingEl => {
          loadingEl.present();
          this.userProfileService
            .updateCustomItemsOrderInDB(
              this.customOrderService.customItemOrdersDetails,
              this.customOrderService.customItemsPacksOrdersDetails
            )
            .then(successResponse => {
              loadingEl.dismiss();
              this.modalCtrl.dismiss(null, "closed", "customItemModal");
            })
            .catch(errResponse => {
              loadingEl.dismiss();
              const header = "Oops... Something went wrong";
              const message =
                "Items couldn't be added to cart. please try again";
              this.addToCartCustomOrderDetailsToCartFailure(header, message);
            });
        });
  }

  addToCartCustomOrderDetailsToCartFailure(header, message) {
    const alert = this.customItemsAddToCartFailAlertCtrl
          .create({
            header,
            message,
            buttons: [
              {
                text: "Retry",
                // role: "cancel",
                cssClass: "secondary",
                handler: cancel => {
                  this.updateCustomCartItemInDB();
                }
              },
              {
                text: "Cancel",
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

          /*
buttons: [
          {
            text: "Add Another Item",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              itemDetailsForm.reset();
            }
          },
          {
            text: "OK",
            handler: () => {
              itemDetailsForm.reset();
              this.router.navigateByUrl(
                "/partnerHomePage/partnerTabs/partnerMyShop"
              );
              // this.customOrderService.customItemOrdersDetails = [];
              // this.customOrderService.customItemsPacksOrdersDetails = [];
              // this.customOrderService.selectableItemsOrders = [];
              // this.customOrderService.isResetAllOrdersNeeded = true;
            }
          }
        ]
          */
  }

  addNewItemKG(slidingItem: IonItemSliding) {
    const uniqueId = this.authenticationService.getUniqueObjectId();
    slidingItem.close();
    this.customKilogramItemsArray.push({
      shopId: this.selectedShopId,
      shopName: this.shopName,
      _id: uniqueId,
      itemId: uniqueId,
      itemName: "",
      itemCount: 0,
      itemUnit: "KG",
      totalPrice: 0,
      itemDiscountedRate: 0,
      itemWeight: 0,
      orderType: "CUSTOM"
    });
  }

  addNewItemPacks(slidingItem: IonItemSliding) {
    const uniqueId = this.authenticationService.getUniqueObjectId();
    slidingItem.close();
    this.customPacketsItemsArray.push({
      shopId: this.selectedShopId,
      shopName: this.shopName,
      _id: uniqueId,
      itemId: uniqueId,
      itemName: "",
      itemCount: 0,
      itemUnit: "PACK",
      totalPrice: 0,
      itemDiscountedRate: 0,
      itemWeight: 0,
      orderType: "CUSTOM"
    });
  }

  onItemNameChangeKG(event, _id) {
    const itemValueChanged = this.customKilogramItemsArray.find(
      arrayItem => arrayItem._id === _id
    );
    if (event.detail.value.length >= 1 && itemValueChanged.itemCount === 0) {
      itemValueChanged.itemCount = 0.5;
    }

    if (event.detail.value.length === 0) {
      itemValueChanged.itemCount = 0;
    }
  }

  onItemNameChangePacks(event, _id) {
    const itemValueChanged = this.customPacketsItemsArray.find(
      arrayItem => arrayItem._id === _id
    );
    if (event.detail.value.length >= 1 && itemValueChanged.itemCount === 0) {
      itemValueChanged.itemCount = 1;
    }

    if (event.detail.value.length === 0) {
      itemValueChanged.itemCount = 0;
    }
  }

  incrementKG(_id, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const _idList = Object.entries(form.value);
    _idList.forEach(item => {
      const searchedItem = this.customKilogramItemsArray.find(
        arrayItem => arrayItem._id === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customKilogramItemsArray.find(
      item => item._id === _id
    );
    customItem.itemCount = customItem.itemCount + 0.5;
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
  }

  incrementPacks(_id, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const _idList = Object.entries(form.value);
    _idList.forEach(item => {
      const searchedItem = this.customPacketsItemsArray.find(
        arrayItem => arrayItem._id === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customPacketsItemsArray.find(
      item => item._id === _id
    );
    customItem.itemCount++;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
  }

  decrementKG(_id, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const _idList = Object.entries(form.value);
    _idList.forEach(item => {
      const searchedItem = this.customKilogramItemsArray.find(
        arrayItem => arrayItem._id === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customKilogramItemsArray.find(
      item => item._id === _id
    );
    customItem.itemCount = customItem.itemCount - 0.5;
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
  }

  decrementPacks(_id, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const _idList = Object.entries(form.value);
    _idList.forEach(item => {
      const searchedItem = this.customPacketsItemsArray.find(
        arrayItem => arrayItem._id === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customPacketsItemsArray.find(
      item => item._id === _id
    );
    customItem.itemCount--;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
  }

  removeItemKG(_id, form: NgForm) {
    this.customKilogramItemsArray = this.customKilogramItemsArray.filter(
      item => item._id !== _id
    );
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
  }

  removeItemPacks(_id, form: NgForm) {
    this.customPacketsItemsArray = this.customPacketsItemsArray.filter(
      item => item._id !== _id
    );
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
  }

  onComplete(kgForm: NgForm, packsForm: NgForm) {
    if (!kgForm.valid && !packsForm.valid) {
      return;
    }
    const _idListKG = Object.entries(kgForm.value);

    _idListKG.forEach(item => {
      const searchedItem = this.customKilogramItemsArray.find(
        arrayItem => arrayItem._id === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });

    const _idListPacks = Object.entries(packsForm.value);

    _idListPacks.forEach(item => {
      const searchedItem = this.customPacketsItemsArray.find(
        arrayItem => arrayItem._id === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });

    this.customKilogramItemsArray = this.customKilogramItemsArray.filter(
      element => element.itemName !== ""
    );
    this.customPacketsItemsArray = this.customPacketsItemsArray.filter(
      element => element.itemName !== ""
    );
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
    // if (
    //   this.customKilogramItemsArray.length > 0 ||
    //   this.customPacketsItemsArray.length > 0
    // ) {
    //   this.messageService.sendMessage("ITEM_ADDED_IN_CART");
    //   this.modalCtrl.dismiss(null, "confirm", "customItemModal");
    // } else {
    //   this.modalCtrl.dismiss(null, "CUSTOM_ORDER_CANCEL", "customItemModal");
    // }
    if (
      this.customKilogramItemsArray.length > 0 ||
      this.customPacketsItemsArray.length > 0
    ) {
      this.messageService.sendMessage("ITEM_ADDED_IN_CART");
      this.savingCartDetailsLoadingCtrl
        .create({
          message: "Adding to cart... Please wait..."
        })
        .then(loadingEl => {
          loadingEl.present();
          this.userProfileService
            .updateCustomItemsOrderInDB(
              this.customOrderService.customItemOrdersDetails,
              this.customOrderService.customItemsPacksOrdersDetails
            )
            .then(successResponse => {
              loadingEl.dismiss();
              this.modalCtrl.dismiss(null, "closed", "customItemModal");
            })
            .catch(errResponse => {
              loadingEl.dismiss();
              this.modalCtrl.dismiss(null, "closed", "customItemModal");
              /*
              ** Reasons
              ** 1. We try saving Once
              ** 2. If Not saved, then already we try saving it at the time of Logging Out everything
              ** So this case will be covered under that
              ** If then also not saved, then there is slight chance that Cart item was not saved in DB
              ** And application Logged out
              ** and cart data lost
              ** We need to understand that DB is a backup basiacally for the cart items
              ** Most important part is the order part.
              ** At that time data loss should not occur
              ** there Exception handling needs to be robust
              */
              // Removing this
              // const header = "Oops... Something went wrong";
              // const message =
              // // "Items couldn't be added to cart. please try again";
              // this.addToCartCustomOrderDetailsToCartFailure(header, message);
            });
        });
    } else {
      this.modalCtrl.dismiss(null, "CUSTOM_ORDER_CANCEL", "customItemModal");
    }
  }

  cancelCustomOrder() {
    this.customOrderService.customItemOrdersDetails = [];
    this.customOrderService.customItemsPacksOrdersDetails = [];
    this.userProfileService.updateCustomItemsOrderInDB([], [])
    .then(successResponse => {
      console.log("SuccessFully Cleared Custom Carts", successResponse);
    })
    .catch(errResponse => {
      console.log("Failure Clearance Custom Carts", errResponse);
    })
    this.modalCtrl.dismiss(null, "CUSTOM_ORDER_CANCEL", "customItemModal");
  }

  removeItemSliding(form: NgForm) {}
}
