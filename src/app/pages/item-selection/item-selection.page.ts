import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController } from '@ionic/angular';
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopList } from "src/app/models/shop-list.model";
// import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
// import { SegmentChangeEventDetail } from "@ionic/core";
import { CustomOrderModalComponent } from '../../modals/custom-order-modal/custom-order-modal.component';
import { CustomOrderService } from 'src/app/services/custom-order.service';
import { ISelectableItemsOrder } from './../../models/selectable-items-orders.model';
import { NgForm } from '@angular/forms';
import { IShopOfferedItems } from 'src/app/models/shop-offered-items.model';

@Component({
  selector: "app-item-selection",
  templateUrl: "./item-selection.page.html",
  styleUrls: ["./item-selection.page.scss"]
})
export class ItemSelectionPage implements OnInit {
  public selectedShopDetails: IShopList;
  public selectedItems: ISelectableItemsOrder[] = [];
  public shopOfferedItemsList: IShopOfferedItems[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private shopItemSelectionService: ShopItemSelectionService,
    private router: Router,
    private modalCtrl: ModalController,
    private customOrderService: CustomOrderService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("shopId")) {
        return;
      }
      const shopId = paramMap.get("shopId");
      this.selectedShopDetails = this.shopItemSelectionService.getShopOfferedItems(shopId);
      this.shopOfferedItemsList = this.selectedShopDetails.shopOfferedItemsList;
      // this.shopOfferedItems = this.selectedShopDetails.shopOfferedItemsList;
    });
  }

  // onToggleItemSearchTypeButton(event: CustomEvent<SegmentChangeEventDetail>) {
  //   console.log(
  //     "Event Details on Toggle Item Search Type Button",
  //     event.detail
  //   );
  //   // if(event.detail === 'ITEM_SELECTION') {
  //   //   this.router.navigateByUrl([''])
  //   // }
  // }

  addCustomOrders() {
    this.modalCtrl.create({component: CustomOrderModalComponent,
      componentProps: {name: 'customItemModal'},
      id: 'customItemModal'}
    )
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(data => {
        console.log("data, role", data.data, data.role);
        console.log("this.customOrderService.customItemOrdersDetails", this.customOrderService.customItemOrdersDetails);
        // if(data.role === 'confirm'){
        //   console.log("Save users data")
        // }
        // else if(data.role === 'cancel'){
        //   console.log("Dont save users data")
        // }
      });
  }

  showOrderDetails() {
    // console.log("showOrderDetails");
  }

  increment(itemId, selectableItemsForm: NgForm) {
    const selectedItemFound = this.selectedItems.find(selectedItem => selectedItem.itemId === itemId);
    if (selectedItemFound) {
      const currentSelectedItem = this.shopOfferedItemsList.filter(item => item.itemId === itemId);
      currentSelectedItem[0].itemCount++;
      selectedItemFound.itemCount++;
      selectedItemFound.totalPrice = selectedItemFound.itemCount * selectedItemFound.itemDiscountedRate;
    } else {
      const currentSelectedItem = this.shopOfferedItemsList.filter(item => item.itemId === itemId);
      currentSelectedItem[0].itemCount++;
      const selectedItem: ISelectableItemsOrder = {
        itemId: currentSelectedItem[0].itemId,
        itemName: currentSelectedItem[0].itemName,
        itemUnit: 'PACKS',
        itemCount: 1,
        itemDiscountedRate: currentSelectedItem[0].itemDiscountedRate,
        totalPrice: currentSelectedItem[0].itemDiscountedRate * 1,
        itemWeight: currentSelectedItem[0].itemWeight
      };
      this.selectedItems.push(selectedItem);
    }

    this.customOrderService.selectableItemsOrders = this.selectedItems;
    console.log("selectedItems", this.selectedItems);
  }

  decrement(itemId, selectableItemsForm: NgForm) {
    const selectedItemFound = this.selectedItems.find(selectedItem => selectedItem.itemId === itemId);
    if (selectedItemFound) {
      if (selectedItemFound.itemCount > 0) {
        const currentSelectedItem = this.shopOfferedItemsList.filter(item => item.itemId === itemId);
        currentSelectedItem[0].itemCount--;
        selectedItemFound.itemCount--;
        selectedItemFound.totalPrice = selectedItemFound.itemCount * selectedItemFound.itemDiscountedRate;
        if (selectedItemFound.itemCount === 0) {
        this.selectedItems = this.selectedItems.filter(element => element.itemId !== itemId);
      }
      }
    }

    this.customOrderService.selectableItemsOrders = this.selectedItems;

    console.log("this.selectedItems on decrement", this.selectedItems);
    // if (selectedItemFound) {
    //   const currentSelectedItem = this.shopOfferedItemsList.filter(item => item.itemId === itemId);
    //   currentSelectedItem[0].itemCount--;
    //   selectedItemFound.itemCount--;
    // } else {
    //   const currentSelectedItem = this.shopOfferedItemsList.filter(item => item.itemId === itemId);
    //   currentSelectedItem[0].itemCount--;
    //   // const selectedItem: ISelectableItemsOrder = {
    //   //   itemId: currentSelectedItem[0].itemId,
    //   //   itemName: currentSelectedItem[0].itemName,
    //   //   itemAmount: '',
    //   //   itemCount: 1
    //   // };
    //   //this.selectedItems.push(selectedItem);
    // }
    // console.log("decrement itemId, selectableItemsForm", itemId, selectableItemsForm);
  }
}
