import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { CustomOrderService } from 'src/app/services/custom-order.service';
import { ICustomOrderItem } from './../../models/custom-order-items.model';

// export interface ICustomItem {
//   itemId: string;
//   itemName: string;
//   itemCount: number;
//   itemAmount: string;
// }

@Component({
  selector: 'app-custom-order-modal',
  templateUrl: './custom-order-modal.component.html',
  styleUrls: ['./custom-order-modal.component.scss'],
})
export class CustomOrderModalComponent implements OnInit {

  // @ViewChild('ionItemSliding', {static: false}) slidingItem: IonItemSliding;

  public customItemsCount: number = 0;
  public customKilogramItemsArray: ICustomOrderItem[] = [
    {
      itemId: 'Item' + (Math.random() * Math.random()),
      itemName: '',
      itemCount: 0,
      itemUnit: 'KG'
    }
  ];

  public customPacketsItemsArray: ICustomOrderItem[] = [
    {
      itemId: 'Item' + (Math.random() * Math.random()),
      itemName: '',
      itemCount: 0,
      itemUnit: 'PACKS'
    }
  ];

  constructor(private modalCtrl: ModalController,
              private customOrderService: CustomOrderService ) {}

  ngOnInit() {
    this.customKilogramItemsArray = this.customOrderService.customItemOrdersDetails &&
    (this.customOrderService.customItemOrdersDetails.length > 0) ?
      this.customOrderService.customItemOrdersDetails :
      this.customKilogramItemsArray;

    this.customPacketsItemsArray = this.customOrderService.customItemsPacksOrdersDetails &&
    (this.customOrderService.customItemsPacksOrdersDetails.length > 0) ?
      this.customOrderService.customItemsPacksOrdersDetails :
      this.customPacketsItemsArray;
  }

  onClose() {
    this.customKilogramItemsArray = this.customKilogramItemsArray.filter(element => element.itemName !== '');
    this.customPacketsItemsArray = this.customPacketsItemsArray.filter(element => element.itemName !== '');
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
    this.modalCtrl.dismiss(null, 'closed', 'customItemModal');
  }

  addNewItemKG(slidingItem: IonItemSliding) {//
    // //console.log("this.slidingItem",this.slidingItem)
    slidingItem.close();
    this.customKilogramItemsArray.push({
      itemId: 'Item' + (Math.random() * Math.random()),
    itemName: '',
    itemCount: 0,
    itemUnit: ''
  });
  // this.slidingItem.close();
  }

  addNewItemPacks(slidingItem: IonItemSliding) {//
    // //console.log("this.slidingItem",this.slidingItem)
    slidingItem.close();
    this.customPacketsItemsArray.push({
      itemId: 'Item' + (Math.random() * Math.random()),
    itemName: '',
    itemCount: 0,
    itemUnit: ''
  });
  // this.slidingItem.close();
  }

  onItemNameChangeKG(event, itemId) {
    const itemValueChanged = this.customKilogramItemsArray.find(arrayItem => arrayItem.itemId === itemId);
    if (event.detail.value.length >= 1 && itemValueChanged.itemCount === 0) {
      itemValueChanged.itemCount = 0.5;
     }

    if (event.detail.value.length === 0) {
      itemValueChanged.itemCount = 0;
     }
  }

  onItemNameChangePacks(event, itemId) {
    const itemValueChanged = this.customPacketsItemsArray.find(arrayItem => arrayItem.itemId === itemId);
    if (event.detail.value.length >= 1 && itemValueChanged.itemCount === 0) {
      itemValueChanged.itemCount = 1;
     }

    if (event.detail.value.length === 0) {
      itemValueChanged.itemCount = 0;
     }
  }

  incrementKG(itemId, form: NgForm) {
    if (!form.valid) {
      //console.log("Form is invalid")
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      ////console.log("Item while ")
      const searchedItem = this.customKilogramItemsArray.find(arrayItem => arrayItem.itemId === item[0]);
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customKilogramItemsArray.find(item => item.itemId === itemId);
    customItem.itemCount = customItem.itemCount + 0.5;
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
  }

  incrementPacks(itemId, form: NgForm) {
    if (!form.valid) {
      //console.log("Form is invalid")
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      ////console.log("Item while ")
      const searchedItem = this.customPacketsItemsArray.find(arrayItem => arrayItem.itemId === item[0]);
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customPacketsItemsArray.find(item => item.itemId === itemId);
    customItem.itemCount++;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
  }

  decrementKG(itemId, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      const searchedItem = this.customKilogramItemsArray.find(arrayItem => arrayItem.itemId === item[0]);
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customKilogramItemsArray.find(item => item.itemId === itemId);
    customItem.itemCount = customItem.itemCount - 0.5;
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
  }

  decrementPacks(itemId, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      const searchedItem = this.customPacketsItemsArray.find(arrayItem => arrayItem.itemId === item[0]);
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customPacketsItemsArray.find(item => item.itemId === itemId);
    customItem.itemCount--;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
  }

  removeItemKG(itemId, form: NgForm) {
    this.customKilogramItemsArray = this.customKilogramItemsArray.filter(item => item.itemId !== itemId);
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
  }

  removeItemPacks(itemId, form: NgForm) {
    this.customPacketsItemsArray = this.customPacketsItemsArray.filter(item => item.itemId !== itemId);
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
  }

  onComplete(kgForm: NgForm, packsForm: NgForm) {
    // console.log("kgForm, packsform",kgForm, packsForm)
    if (!kgForm.valid && !packsForm.valid ) {
      return;
    }
    const itemIdListKG = Object.entries(kgForm.value);

    // console.log("ItemList", itemIdListKG);

    itemIdListKG.forEach(element => {

    });

    itemIdListKG.forEach(item => {
      const searchedItem = this.customKilogramItemsArray.find(arrayItem => arrayItem.itemId === item[0]);
      searchedItem.itemName = item[1].toString();
    });

    const itemIdListPacks = Object.entries(packsForm.value);

    // console.log("ItemList", itemIdListPacks);

    itemIdListPacks.forEach(element => {

    });

    itemIdListPacks.forEach(item => {
      const searchedItem = this.customPacketsItemsArray.find(arrayItem => arrayItem.itemId === item[0]);
      searchedItem.itemName = item[1].toString();
    });
    // console.log("this.customKilogramItemsArray", this.customKilogramItemsArray);
    // console.log("this.customPacketsItemsArray", this.customPacketsItemsArray);
    this.customKilogramItemsArray = this.customKilogramItemsArray.filter(element => element.itemName !== '');
    this.customPacketsItemsArray = this.customPacketsItemsArray.filter(element => element.itemName !== '');
    this.customOrderService.customItemOrdersDetails = this.customKilogramItemsArray;
    this.customOrderService.customItemsPacksOrdersDetails = this.customPacketsItemsArray;
    this.modalCtrl.dismiss(null, 'confirm', 'customItemModal');
  }

  cancelCustomOrder() {
    this.customOrderService.customItemOrdersDetails = [];
    this.customOrderService.customItemsPacksOrdersDetails = [];
    this.modalCtrl.dismiss(null, 'Custom Order Cancelled', 'customItemModal');
  }

  removeItemSliding(form: NgForm) {

  }

}
