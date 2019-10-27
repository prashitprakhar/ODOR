import { Component, OnInit, Input } from "@angular/core";
import { ModalController, IonItemSliding, AlertController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { CustomOrderService } from "src/app/services/custom-order.service";
import { ICustomOrderItem } from "./../../models/custom-order-items.model";
import { NavParams } from '@ionic/angular';
// import { ModalController, AlertController } from "@ionic/angular";

@Component({
  selector: "app-custom-order-modal",
  templateUrl: "./custom-order-modal.component.html",
  styleUrls: ["./custom-order-modal.component.scss"]
})
export class CustomOrderModalComponent implements OnInit {

  public selectedShopId: string;

  public customItemsCount: number = 0;
  // public customKilogramItemsArray: ICustomOrderItem[] = [
  //   {
  //     shopId: this.selectedShopId,
  //     itemId: "Item" + Math.random() * Math.random(),
  //     itemName: "",
  //     itemCount: 0,
  //     itemUnit: "KG",
  //     totalPrice: 0,
  //     itemDiscountedRate: 0,
  //     itemWeight: 0,
  //     orderType: "CUSTOM"
  //   }
  // ];

  // public customPacketsItemsArray: ICustomOrderItem[] = [
  //   {
  //     shopId: this.selectedShopId,
  //     itemId: "Item" + Math.random() * Math.random(),
  //     itemName: "",
  //     itemCount: 0,
  //     itemUnit: "PACK",
  //     totalPrice: 0,
  //     itemDiscountedRate: 0,
  //     itemWeight: 0,
  //     orderType: "CUSTOM"
  //   }
  // ];

  // public otherCustomOrderInCartMessage: string = 'You have custom orders for other shop. Do you want to remove those and continu'
  public customKilogramItemsArray: ICustomOrderItem[] = [];

  public customPacketsItemsArray: ICustomOrderItem[] = [];

  constructor(
    private modalCtrl: ModalController,
    private customOrderService: CustomOrderService,
    private navParams: NavParams,
    private alertCtrl: AlertController
  ) {
    this.selectedShopId = navParams.get('selectedShopId');
    // // console.log("constructor loaded",);
    this.customKilogramItemsArray = [
      {
        shopId: this.selectedShopId,
        itemId: "Item" + Math.random() * Math.random(),
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
        itemId: "Item" + Math.random() * Math.random(),
        itemName: "",
        itemCount: 0,
        itemUnit: "PACK",
        totalPrice: 0,
        itemDiscountedRate: 0,
        itemWeight: 0,
        orderType: "CUSTOM"
      }
    ];
  }

  ngOnInit() {
    if ((this.customOrderService.customItemsPacksOrdersDetails &&
      this.customOrderService.customItemsPacksOrdersDetails.length > 0 &&
      this.customOrderService.customItemsPacksOrdersDetails[0].shopId !== this.selectedShopId) ||
      (this.customOrderService.customItemOrdersDetails &&
        this.customOrderService.customItemOrdersDetails.length > 0 &&
        this.customOrderService.customItemOrdersDetails[0].shopId !== this.selectedShopId) ||
        this.customOrderService.selectableItemsOrders &&
        this.customOrderService.selectableItemsOrders.length > 0 &&
        this.customOrderService.selectableItemsOrders[0].shopId !== this.selectedShopId) {
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
                  // console.log("cancel ***");
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
    this.customKilogramItemsArray =
      ((this.customOrderService.customItemOrdersDetails &&
      this.customOrderService.customItemOrdersDetails.length)) > 0
        ? (this.customOrderService.customItemOrdersDetails[0].shopId !== this.selectedShopId ? this.customKilogramItemsArray :
          this.customOrderService.customItemOrdersDetails)
        : this.customKilogramItemsArray;

    this.customPacketsItemsArray =
      ((this.customOrderService.customItemsPacksOrdersDetails &&
      this.customOrderService.customItemsPacksOrdersDetails.length) ) > 0
        ? (this.customOrderService.customItemsPacksOrdersDetails[0].shopId !== this.selectedShopId ? this.customPacketsItemsArray :
          this.customOrderService.customItemsPacksOrdersDetails)
        : this.customPacketsItemsArray;

        // // console.log("oninit Modal this.customKilogramItemsArray",this.customKilogramItemsArray);
        // // console.log("oninit Modal this.customPacketsItemsArray",this.customPacketsItemsArray);
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
    this.modalCtrl.dismiss(null, "closed", "customItemModal");
  }

  addNewItemKG(slidingItem: IonItemSliding) {
    slidingItem.close();
    this.customKilogramItemsArray.push({
      shopId: this.selectedShopId,
      itemId: "Item" + Math.random() * Math.random(),
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
    slidingItem.close();
    this.customPacketsItemsArray.push({
      shopId: this.selectedShopId,
      itemId: "Item" + Math.random() * Math.random(),
      itemName: "",
      itemCount: 0,
      itemUnit: "PACK",
      totalPrice: 0,
      itemDiscountedRate: 0,
      itemWeight: 0,
      orderType: "CUSTOM"
    });
  }

  onItemNameChangeKG(event, itemId) {
    const itemValueChanged = this.customKilogramItemsArray.find(
      arrayItem => arrayItem.itemId === itemId
    );
    if (event.detail.value.length >= 1 && itemValueChanged.itemCount === 0) {
      itemValueChanged.itemCount = 0.5;
    }

    if (event.detail.value.length === 0) {
      itemValueChanged.itemCount = 0;
    }
  }

  onItemNameChangePacks(event, itemId) {

    const itemValueChanged = this.customPacketsItemsArray.find(
      arrayItem => arrayItem.itemId === itemId
    );
    if (event.detail.value.length >= 1 && itemValueChanged.itemCount === 0) {
      itemValueChanged.itemCount = 1;
    }

    if (event.detail.value.length === 0) {
      itemValueChanged.itemCount = 0;
    }
  }

  incrementKG(itemId, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      const searchedItem = this.customKilogramItemsArray.find(
        arrayItem => arrayItem.itemId === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customKilogramItemsArray.find(
      item => item.itemId === itemId
    );
    customItem.itemCount = customItem.itemCount + 0.5;
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
  }

  incrementPacks(itemId, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      const searchedItem = this.customPacketsItemsArray.find(
        arrayItem => arrayItem.itemId === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customPacketsItemsArray.find(
      item => item.itemId === itemId
    );
    customItem.itemCount++;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
  }

  decrementKG(itemId, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      const searchedItem = this.customKilogramItemsArray.find(
        arrayItem => arrayItem.itemId === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customKilogramItemsArray.find(
      item => item.itemId === itemId
    );
    customItem.itemCount = customItem.itemCount - 0.5;
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
  }

  decrementPacks(itemId, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      const searchedItem = this.customPacketsItemsArray.find(
        arrayItem => arrayItem.itemId === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customPacketsItemsArray.find(
      item => item.itemId === itemId
    );
    customItem.itemCount--;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
  }

  removeItemKG(itemId, form: NgForm) {
    this.customKilogramItemsArray = this.customKilogramItemsArray.filter(
      item => item.itemId !== itemId
    );
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
  }

  removeItemPacks(itemId, form: NgForm) {
    this.customPacketsItemsArray = this.customPacketsItemsArray.filter(
      item => item.itemId !== itemId
    );
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
  }

  onComplete(kgForm: NgForm, packsForm: NgForm) {
    if (!kgForm.valid && !packsForm.valid) {
      return;
    }
    const itemIdListKG = Object.entries(kgForm.value);

    itemIdListKG.forEach(item => {
      const searchedItem = this.customKilogramItemsArray.find(
        arrayItem => arrayItem.itemId === item[0]
      );
      searchedItem.itemName = item[1].toString();
    });

    const itemIdListPacks = Object.entries(packsForm.value);

    itemIdListPacks.forEach(item => {
      const searchedItem = this.customPacketsItemsArray.find(
        arrayItem => arrayItem.itemId === item[0]
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
    this.modalCtrl.dismiss(null, "confirm", "customItemModal");
  }

  cancelCustomOrder() {
    this.customOrderService.customItemOrdersDetails = [];
    this.customOrderService.customItemsPacksOrdersDetails = [];
    this.modalCtrl.dismiss(null, "Custom Order Cancelled", "customItemModal");
  }

  removeItemSliding(form: NgForm) {}
}
