import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, AlertController } from "@ionic/angular";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { CustomOrderModalComponent } from "../../modals/custom-order-modal/custom-order-modal.component";
import { CustomOrderService } from "src/app/services/custom-order.service";
import { ISelectableItemsOrder } from "./../../models/selectable-items-orders.model";
import { NgForm } from "@angular/forms";
import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
import { Subscription } from "rxjs";
import { SearchItemModalComponent } from "src/app/modals/search-item-modal/search-item-modal.component";
import { MessageService } from "src/app/shared/services/message.service";
import { IShopData } from "src/app/models/shop-data.model";
import { NetworkService } from "src/app/shared/services/network.service";
import { IShopOfferedItemsData } from "src/app/models/shop-offered-items-data.model";
import { IShopProfile } from "src/app/models/shop-profile.model";
import { CurrentShopProfileService } from "src/app/shared/internal-services/current-shop-profile.service";
import { SortByService } from "src/app/shared/utils/sort-by.service";

@Component({
  selector: "app-item-selection",
  templateUrl: "./item-selection.page.html",
  styleUrls: ["./item-selection.page.scss"]
})
export class ItemSelectionPage implements OnInit, OnDestroy {
  public selectedShopDetails: IShopData;
  public selectedItems: ISelectableItemsOrder[] = [];
  public shopOfferedItemsList: IShopOfferedItems[] = [];
  public shopId: string = "";
  public resetCart: boolean = false;
  public shopOfferedItemsSubs: Subscription;
  public searchText: string = "";
  public networkStatusSubs: Subscription;
  public networkStatus: boolean = true;
  public userSelectionsFromLocalStorage;
  public userCustomItemsFromLocalStorage;
  public userSelectionsLocalStorageSub: Subscription;

  // New Properties
  public selectedShopOfferedItems: IShopOfferedItemsData; // Alternative for this.selectedShopDetails
  public shopProfile: IShopProfile;
  public deviceFCMToken: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private shopItemSelectionService: ShopItemSelectionService,
    private router: Router,
    private modalCtrl: ModalController,
    private searchItemModalCtrl: ModalController,
    private alertCtrl: AlertController,
    private customOrderService: CustomOrderService,
    private messageService: MessageService,
    private networkService: NetworkService,
    private currentShopProfileService: CurrentShopProfileService,
    private sortByService: SortByService
  ) {}

  // doRefresh(event) {
  //   // console.log('Begin async operation');

  //   // setTimeout(() => {
  //   //   console.log('Async operation has ended');
  //   //   event.target.complete();
  //   // }, 2000);
  //   this.getInitialData(event);
  // }

  async getInitialData(event = null) {
    if (this.customOrderService.selectableItemsOrders) {
      this.selectedItems = this.customOrderService.selectableItemsOrders;
    }
    this.activatedRoute.paramMap.subscribe(async paramMap => {
      if (!paramMap.has("shopId")) {
        return;
      }
      this.shopId = paramMap.get("shopId");
      const shopData = await this.shopItemSelectionService.getShopOfferedItemsForCustomers(
        this.shopId
      );
      this.shopProfile = await this.shopItemSelectionService.getShopProfileForCustomers(
        this.shopId.toString()
      );
      if (shopData) {
        this.currentShopProfileService.currentShopProfile = this.shopProfile;
        this.selectedShopOfferedItems = shopData;
        this.customOrderService.selectedShopDetails = this.selectedShopOfferedItems;
        this.shopOfferedItemsList = [
          ...this.selectedShopOfferedItems.shopOfferedItemsList
        ];
        this.userSelectionsLocalStorageSub = this.shopItemSelectionService
          .getOrderedItemsFromLocalStorage()
          .subscribe(localStorageUserSelection => {
            this.userSelectionsFromLocalStorage = JSON.parse(
              localStorageUserSelection.value
            );
            if (
              this.userSelectionsFromLocalStorage &&
              this.userSelectionsFromLocalStorage.selectableItems &&
              this.userSelectionsFromLocalStorage.selectableItems.length > 0 &&
              this.shopOfferedItemsList.length > 0
            ) {
              this.userSelectionsFromLocalStorage.selectableItems.forEach(
                selectableStorageItem => {
                  const storedItem = this.shopOfferedItemsList.find(
                    eachItem =>
                      eachItem.itemId === selectableStorageItem["itemId"]
                  );
                  storedItem.itemCount = selectableStorageItem.itemCount;
                }
              );
              this.customOrderService.selectableItemsOrders = this.userSelectionsFromLocalStorage.selectableItems;
              this.messageService.sendMessage("ITEM_ADDED_IN_CART");
            }
          });
      } else {
        // Show the skeleton || Show message that there is no item in the shop currently
      }
      if (this.shopProfile) {
        this.customOrderService.currentSelectedShopName = this.shopProfile.shopName;
      }
    });
  }

  // handleRefresher(event) {
  //   if (event) {
  //     setTimeout(() => {
  //       event.target.complete();
  //     }, 2000);
  //   }
  // }

  ngOnInit() {
    this.networkStatusSubs = this.networkService
      .checkNetworkStatus()
      .subscribe(networkData => {
        if (!networkData.connected) {
          this.networkStatus = false;
          this.messageService.sendNetworkStatusMessage({
            NETWORK_CONNECTION: false
          });
        } else {
          this.networkStatus = true;
          this.messageService.sendNetworkStatusMessage({
            NETWORK_CONNECTION: true
          });
          this.getInitialData();
        }
      });
    this.shopItemSelectionService.getDeviceFCMToken().then(deviceFCMToken => {
      this.deviceFCMToken = deviceFCMToken;
    });
  }

  ngOnDestroy() {
    if (this.shopOfferedItemsSubs) {
      this.shopOfferedItemsSubs.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.userSelectionsLocalStorageSub = this.shopItemSelectionService
      .getOrderedItemsFromLocalStorage()
      .subscribe(localStorageUserSelection => {
        this.userSelectionsFromLocalStorage = JSON.parse(
          localStorageUserSelection.value
        );
        if (
          this.userSelectionsFromLocalStorage &&
          this.userSelectionsFromLocalStorage.selectableItems &&
          this.shopOfferedItemsList.length > 0
        ) {
          this.userSelectionsFromLocalStorage.selectableItems.forEach(
            selectableStorageItem => {
              const storedItem = this.shopOfferedItemsList.find(
                eachItem => eachItem.itemId === selectableStorageItem["itemId"]
              );
              storedItem.itemCount = selectableStorageItem.itemCount;
            }
          );
          this.customOrderService.selectableItemsOrders = this.userSelectionsFromLocalStorage.selectableItems;
          this.messageService.sendMessage("ITEM_ADDED_IN_CART");
        }
      });
    if (this.customOrderService.selectableItemsOrders) {
      this.selectedItems = this.customOrderService.selectableItemsOrders;
    }
    const selectableOrders = this.customOrderService.selectableItemsOrders;
    if (selectableOrders || this.customOrderService.isResetAllOrdersNeeded) {
      if (this.customOrderService.isResetAllOrdersNeeded) {
        this.selectedItems = [];
        this.shopOfferedItemsList.forEach(element => {
          element.itemCount = 0;
        });
      } else {
        let filteredSelectableOrders = [];
        if (selectableOrders) {
          filteredSelectableOrders = selectableOrders.filter(
            element => element.shopId !== this.shopId
          );
        }
        if (filteredSelectableOrders.length > 0) {
          this.shopOfferedItemsList.forEach(element => {
            element.itemCount = 0;
          });
        }
      }
    }
  }

  ionViewDidEnter() {}

  ionViewWillLeave() {
    this.persistSelection();
    if (this.userSelectionsLocalStorageSub) {
      this.userSelectionsLocalStorageSub.unsubscribe();
    }
  }

  ionViewDidLeave() {}

  persistSelection() {
    if (!this.customOrderService.selectableItemsOrders) {
      this.customOrderService.selectableItemsOrders = this.selectedItems;
    }
  }

  searchItem() {
    this.searchItemModalCtrl
      .create({
        component: SearchItemModalComponent,
        componentProps: {
          name: "customItemModal",
          selectedShopId: this.shopId
        },
        id: "searchItemModal"
      })
      .then(searchModalEl => {
        searchModalEl.present();
        return searchModalEl.onDidDismiss();
      })
      .then(data => {
        this.getInitialData();
      });
  }

  addCustomOrders() {
    this.modalCtrl
      .create({
        component: CustomOrderModalComponent,
        componentProps: {
          name: "customItemModal",
          selectedShopId: this.shopId
        },
        id: "customItemModal"
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(data => {});
  }

  showOrderDetails() {}

  checkForMultipleShopSelection(itemId, selectableItemsForm: NgForm) {
    this.resetCart = false;
    this.customOrderService.isResetAllOrdersNeeded = false;
    const customKGOrders = this.customOrderService.customItemOrdersDetails;
    const customPacksOrders = this.customOrderService
      .customItemsPacksOrdersDetails;
    const selectableOrders = this.customOrderService.selectableItemsOrders;

    if (customKGOrders || customPacksOrders || selectableOrders) {
      let filteredCustomKGOrders = [];
      let filteredCustomPacksOrders = [];
      let filteredSelectableOrders = [];
      if (customKGOrders) {
        filteredCustomKGOrders = customKGOrders.filter(
          element => element.shopId !== this.shopId
        );
      }
      if (customPacksOrders) {
        filteredCustomPacksOrders = customPacksOrders.filter(
          element => element.shopId !== this.shopId
        );
      }
      if (selectableOrders) {
        filteredSelectableOrders = selectableOrders.filter(
          element => element.shopId !== this.shopId
        );
      }

      if (
        filteredCustomKGOrders.length > 0 ||
        filteredSelectableOrders.length > 0 ||
        filteredCustomPacksOrders.length > 0
      ) {
        const alert = this.alertCtrl
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
                  this.resetCart = false;
                }
              },
              {
                text: "Yes",
                handler: () => {
                  this.resetCart = true;
                  this.shopOfferedItemsList.forEach(element => {
                    element.itemCount = 0;
                  });
                  this.selectedItems = [];
                  this.customOrderService.customItemOrdersDetails = [];
                  this.customOrderService.customItemsPacksOrdersDetails = [];
                  this.customOrderService.selectableItemsOrders = [];
                  this.customOrderService.isResetAllOrdersNeeded = false;
                  this.increment(itemId, selectableItemsForm);
                }
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
      } else {
        this.increment(itemId, selectableItemsForm);
      }
    } else {
      this.increment(itemId, selectableItemsForm);
    }
  }

  increment(itemId, selectableItemsForm: NgForm) {
    const selectedItemFound = this.selectedItems.find(
      selectedItem => selectedItem.itemId === itemId
    );
    if (selectedItemFound) {
      const currentSelectedItem = this.shopOfferedItemsList.filter(
        item => item.itemId === itemId
      );
      currentSelectedItem[0].itemCount++;
      selectedItemFound.itemCount++;
      selectedItemFound.totalPrice =
        selectedItemFound.itemCount * selectedItemFound.itemDiscountedRate;
    } else {
      const currentSelectedItem = this.shopOfferedItemsList.filter(
        item => item.itemId === itemId
      );
      currentSelectedItem[0].itemCount++;
      const selectedItem: ISelectableItemsOrder = {
        shopId: this.shopId,
        shopName: this.shopProfile.shopName,
        itemId: currentSelectedItem[0].itemId,
        itemName: currentSelectedItem[0].itemName,
        itemUnit: currentSelectedItem[0].itemUnit,
        itemCount: 1,
        itemDiscountedRate: currentSelectedItem[0].itemDiscountedRate,
        totalPrice: currentSelectedItem[0].itemDiscountedRate * 1,
        itemWeight: currentSelectedItem[0].itemWeight,
        orderType: "SELECT"
      };
      this.selectedItems.push(selectedItem);
    }
    this.customOrderService.selectableItemsOrders = this.selectedItems;
    this.messageService.sendMessage("ITEM_ADDED_IN_CART");
  }

  decrement(itemId, selectableItemsForm: NgForm) {
    const selectedItemFound = this.selectedItems.find(
      selectedItem => selectedItem.itemId === itemId
    );
    if (selectedItemFound) {
      if (selectedItemFound.itemCount > 0) {
        const currentSelectedItem = this.shopOfferedItemsList.filter(
          item => item.itemId === itemId
        );
        currentSelectedItem[0].itemCount--;
        selectedItemFound.itemCount--;
        selectedItemFound.totalPrice =
          selectedItemFound.itemCount * selectedItemFound.itemDiscountedRate;
        if (selectedItemFound.itemCount === 0) {
          this.selectedItems = this.selectedItems.filter(
            element => element.itemId !== itemId
          );
        }
      }
    }

    this.customOrderService.selectableItemsOrders = this.selectedItems;
    this.messageService.sendMessage("ITEM_REMOVED_IN_CART");
  }

  clearMessage(): void {
    // clear message
    this.messageService.clearMessage();
  }
}
