import { Component, OnInit, OnDestroy } from "@angular/core";
import { ModalController, NavParams, AlertController } from "@ionic/angular";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
import { Subscription } from "rxjs";
import { ISelectableItemsOrder } from "src/app/models/selectable-items-orders.model";
import { NgForm } from "@angular/forms";
import { CustomOrderService } from "src/app/services/custom-order.service";
import { MessageService } from "src/app/shared/services/message.service";
import { IShopOfferedItemsData } from 'src/app/models/shop-offered-items-data.model';
import { IShopProfile } from 'src/app/models/shop-profile.model';

@Component({
  selector: "app-search-item-modal",
  templateUrl: "./search-item-modal.component.html",
  styleUrls: ["./search-item-modal.component.scss"]
})
export class SearchItemModalComponent implements OnInit, OnDestroy {
  public shopId: string = "";
  public selectedShopDetails: IShopOfferedItemsData;
  public shopOfferedItemsList: IShopOfferedItems[] = [];
  public searchableShopOfferedItemsList: IShopOfferedItems[] = [];
  public shopOfferedItemsSubs: Subscription;
  public selectedItems: ISelectableItemsOrder[] = [];
  public resetCart: boolean = false;
  public searchText: string = "";
  public shopProfile: IShopProfile;
  public userSelectionsFromLocalStorage;
  public userSelectionsLocalStorageSub: Subscription;

  constructor(
    private searchItemModalCtrl: ModalController,
    private navParams: NavParams,
    private shopItemSelectionService: ShopItemSelectionService,
    private customOrderService: CustomOrderService,
    private alertCtrl: AlertController,
    private messageService: MessageService
  ) {
    this.shopId = navParams.get("selectedShopId");
  }

  ngOnInit() {
    if (this.customOrderService.selectableItemsOrders) {
      this.selectedItems = this.customOrderService.selectableItemsOrders;
    }
    this.setInitialData();
  }

  async setInitialData() {
    const shopData = await this.shopItemSelectionService.getShopOfferedItemsForCustomers(
      this.shopId
    );
    this.shopProfile = await this.shopItemSelectionService.getShopProfileForCustomers(this.shopId.toString());
    this.selectedShopDetails = shopData;
    this.shopOfferedItemsList = [
      ...this.selectedShopDetails.shopOfferedItemsList
    ];
    this.searchableShopOfferedItemsList = [...this.shopOfferedItemsList];
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
                      eachItem._id === selectableStorageItem["_id"]
                  );
                  storedItem.itemCount = selectableStorageItem.itemCount;
                }
              );
              this.customOrderService.selectableItemsOrders = this.userSelectionsFromLocalStorage.selectableItems;
              this.messageService.sendMessage("ITEM_ADDED_IN_CART");
            }
          });
    //
    // const selectableOrders = this.customOrderService.selectableItemsOrders;
    // if (selectableOrders || this.customOrderService.isResetAllOrdersNeeded) {
    //   if (this.customOrderService.isResetAllOrdersNeeded) {
    //     this.selectedItems = [];
    //     this.shopOfferedItemsList.forEach(element => {
    //       element.itemCount = 0;
    //     });
    //   } else {
    //     let filteredSelectableOrders = [];
    //     if (selectableOrders) {
    //       filteredSelectableOrders = selectableOrders.filter(
    //         element => element.shopId !== this.shopId
    //       );
    //     }
    //     if (filteredSelectableOrders.length > 0) {
    //       this.shopOfferedItemsList.forEach(element => {
    //         element.itemCount = 0;
    //       });
    //     }
    //   }
    // }
  }

  ngOnDestroy() {
    if (this.selectedItems) {
      this.customOrderService.selectableItemsOrders = this.selectedItems.filter(
        element => element.itemCount > 0
      );
    }
    if (this.shopOfferedItemsSubs) {
      this.shopOfferedItemsSubs.unsubscribe();
    }
  }

  onClose() {
    this.searchItemModalCtrl.dismiss(null, "closed", "searchItemModal");
  }

  checkForMultipleShopSelection(_id, selectableItemsForm: NgForm) {
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
                  // console.log("cancel ***");
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
                  this.increment(_id, selectableItemsForm);
                }
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
      } else {
        this.increment(_id, selectableItemsForm);
      }
    } else {
      this.increment(_id, selectableItemsForm);
    }
  }

  decrement(_id, selectableItemsForm: NgForm) {
    const selectedItemFound = this.selectedItems.find(
      selectedItem => selectedItem._id === _id
    );
    if (selectedItemFound) {
      if (selectedItemFound.itemCount > 0) {
        const currentSelectedItem = this.shopOfferedItemsList.filter(
          item => item._id === _id
        );
        currentSelectedItem[0].itemCount--;
        selectedItemFound.itemCount--;
        selectedItemFound.totalPrice =
          selectedItemFound.itemCount * selectedItemFound.itemDiscountedRate;
        if (selectedItemFound.itemCount === 0) {
          this.selectedItems = this.selectedItems.filter(
            element => element._id !== _id
          );
        }
      }
    }
    if (this.selectedItems) {
      this.customOrderService.selectableItemsOrders = this.selectedItems.filter(
        element => element.itemCount > 0
      );
    }
    this.messageService.sendMessage("ITEM_REMOVED_IN_CART");
  }

  increment(_id, selectableItemsForm: NgForm) {
    let selectedItemFound;
    if (this.selectedItems) {
      selectedItemFound = this.selectedItems.find(selectedItem => {
        return selectedItem._id === _id;
      });
    } else {
      this.selectedItems = [];
    }
    if (selectedItemFound) {
      const currentSelectedItem = this.shopOfferedItemsList.filter(
        item => item._id === _id
      );
      currentSelectedItem[0].itemCount++;
      selectedItemFound.itemCount++;
      selectedItemFound.totalPrice =
        selectedItemFound.itemCount * selectedItemFound.itemDiscountedRate;
    } else {
      const currentSelectedItem = this.shopOfferedItemsList.filter(
        item => item._id === _id
      );
      currentSelectedItem[0].itemCount++;
      const selectedItem: ISelectableItemsOrder = {
        shopId: this.shopId,
        shopName: this.shopProfile.shopName,
        _id: currentSelectedItem[0]._id,
        itemId: currentSelectedItem[0]._id,
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

  initializeSearchItem() {
    this.searchableShopOfferedItemsList = [...this.shopOfferedItemsList];
  }

  searchItems() {
    if (this.searchText === "") {
      this.initializeSearchItem();
    } else {
      this.initializeSearchItem();
      this.searchableShopOfferedItemsList = this.shopOfferedItemsList.filter(
        element => {
          const searchtextLocal = this.searchText.trim().toLowerCase();
          return element.itemName.toLowerCase().includes(searchtextLocal);
        }
      );
    }
  }
}
