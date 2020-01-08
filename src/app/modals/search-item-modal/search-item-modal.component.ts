import { Component, OnInit, OnDestroy } from "@angular/core";
import { ModalController, NavParams, AlertController } from "@ionic/angular";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
import { IShopList } from "src/app/models/shop-list.model";
import { Subscription } from "rxjs";
import { ISelectableItemsOrder } from "src/app/models/selectable-items-orders.model";
import { NgForm } from "@angular/forms";
import { CustomOrderService } from "src/app/services/custom-order.service";
import { MessageService } from 'src/app/shared/services/message.service';
import { IShopData } from 'src/app/models/shop-data.model';

@Component({
  selector: "app-search-item-modal",
  templateUrl: "./search-item-modal.component.html",
  styleUrls: ["./search-item-modal.component.scss"]
})
export class SearchItemModalComponent implements OnInit, OnDestroy {
  public shopId: string = "";
  // public selectedShopDetails: IShopList;
  public selectedShopDetails: IShopData;
  public shopOfferedItemsList: IShopOfferedItems[] = [];
  public searchableShopOfferedItemsList: IShopOfferedItems[] = [];
  public shopOfferedItemsSubs: Subscription;
  public selectedItems: ISelectableItemsOrder[] = [];
  public resetCart: boolean = false;
  public searchText: string = "";

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
    this.shopOfferedItemsSubs = this.shopItemSelectionService
      // .getShopOfferedItems(this.shopId)
      .getShopOfferedItemsForCustomer(this.shopId)
      .subscribe(shop => {
        this.selectedShopDetails = shop;
      });
    this.shopOfferedItemsList = [
      ...this.selectedShopDetails.shopOfferedItems
    ];
    this.searchableShopOfferedItemsList = [...this.shopOfferedItemsList];
  }

  ngOnDestroy() {
    // console.log("ondestroy Before ******", this.customOrderService.selectableItemsOrders);
    if (this.selectedItems) {
      this.customOrderService.selectableItemsOrders = this.selectedItems.filter(
        element => element.itemCount > 0
      );
    }
    // console.log("ondestroy After ******", this.customOrderService.selectableItemsOrders);
    if (this.shopOfferedItemsSubs) {
      this.shopOfferedItemsSubs.unsubscribe();
    }
  }

  onClose() {
    this.searchItemModalCtrl.dismiss(null, "closed", "searchItemModal");
  }

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
    if (this.selectedItems) {
      this.customOrderService.selectableItemsOrders = this.selectedItems.filter(
        element => element.itemCount > 0
      );
    }
    // this.customOrderService.selectableItemsOrders = this.selectedItems;
    this.messageService.sendMessage('ITEM_REMOVED_IN_CART');
  }

  increment(itemId, selectableItemsForm: NgForm) {
    let selectedItemFound;
    if (this.selectedItems) {
      selectedItemFound = this.selectedItems.find(selectedItem => {
        return selectedItem.itemId === itemId;
      });
    } else {
      this.selectedItems = [];
    }
    // const selectedItemFound = this.selectedItems.find(selectedItem => {
    //   return selectedItem.itemId === itemId;
    // });
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
        shopName: this.selectedShopDetails.shopName,
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
      // console.log("selectedItems selectedItems selectedItems selectedItems", this.selectedItems);
    }
    this.customOrderService.selectableItemsOrders = this.selectedItems;
    this.messageService.sendMessage('ITEM_ADDED_IN_CART');
  }

  initializeSearchItem() {
    this.searchableShopOfferedItemsList = [...this.shopOfferedItemsList];
  }

  searchItems() {
    if (this.searchText === '') {
      this.initializeSearchItem();
    } else {
    this.initializeSearchItem();
    // console.log("searchText searchItems*****", this.searchText);
    // console.log(
    //   "searchItems---> Before filter ----> this.shopOfferedItem******",
    //   this.shopOfferedItemsList
    // );
    this.searchableShopOfferedItemsList = this.shopOfferedItemsList.filter(element => {
        const searchtextLocal = this.searchText.trim().toLowerCase();
        // console.log("searchtextLocal ******", searchtextLocal);
        return element.itemName.toLowerCase().includes(searchtextLocal);
      }
    );
    // console.log("searchItems---> After filter ----> this.shopOfferedItem******", this.shopOfferedItemsList);
    // this.shopOfferedItemsList = [...this.shopOfferedItemsList];
    }
  }
}
