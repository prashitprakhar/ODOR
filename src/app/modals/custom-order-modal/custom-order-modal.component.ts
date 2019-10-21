import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { CustomOrderService } from 'src/app/services/custom-order.service';

export interface ICustomItem {
  itemId: string;
  itemName: string;
  itemCount: number;
  itemAmount: string;
}

@Component({
  selector: 'app-custom-order-modal',
  templateUrl: './custom-order-modal.component.html',
  styleUrls: ['./custom-order-modal.component.scss'],
})
export class CustomOrderModalComponent implements OnInit {

  // @ViewChild('ionItemSliding', {static: false}) slidingItem: IonItemSliding;

  public customItemsCount: number = 0;
  public customItemsArray: ICustomItem[] = [
    {
      itemId: 'Item' + (Math.random() * Math.random()),
      itemName: '',
      itemCount: 0,
      itemAmount: ''
    }
  ];

  constructor(private modalCtrl: ModalController,
              private customOrderService: CustomOrderService ) {}

  ngOnInit() {
    this.customItemsArray = this.customOrderService.customItemOrdersDetails &&
    (this.customOrderService.customItemOrdersDetails.length > 0) ?
      this.customOrderService.customItemOrdersDetails :
      this.customItemsArray;
  }

  onClose() {
    this.customOrderService.customItemOrdersDetails = this.customItemsArray;
    this.modalCtrl.dismiss(null, 'closed', 'customItemModal');
  }

  addNewItem(slidingItem: IonItemSliding) {//
    // console.log("this.slidingItem",this.slidingItem)
    slidingItem.close();
    this.customItemsArray.push({
      itemId: 'Item' + (Math.random() * Math.random()),
    itemName: '',
    itemCount: 0,
    itemAmount: ''
  });
  // this.slidingItem.close();
  }

  onItemNameChange(event, itemId) {
    const itemValueChanged = this.customItemsArray.find(arrayItem => arrayItem.itemId === itemId);
    if (event.detail.value.length >= 1 && itemValueChanged.itemCount === 0) {
      itemValueChanged.itemCount = 1;
     }

    if (event.detail.value.length === 0) {
      itemValueChanged.itemCount = 0;
     }
  }

  increment(itemId, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      //console.log("Item while ")
      const searchedItem = this.customItemsArray.find(arrayItem => arrayItem.itemId === item[0]);
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customItemsArray.find(item => item.itemId === itemId);
    customItem.itemCount++;
    this.customOrderService.customItemOrdersDetails = this.customItemsArray;
  }

  decrement(itemId, form: NgForm) {
    if (!form.valid) {
      return;
    }
    const itemIdList = Object.entries(form.value);
    itemIdList.forEach(item => {
      const searchedItem = this.customItemsArray.find(arrayItem => arrayItem.itemId === item[0]);
      searchedItem.itemName = item[1].toString();
    });
    const customItem = this.customItemsArray.find(item => item.itemId === itemId);
    customItem.itemCount--;
    this.customOrderService.customItemOrdersDetails = this.customItemsArray;
  }

  removeItem(itemId, form: NgForm) {
    this.customItemsArray = this.customItemsArray.filter(item => item.itemId !== itemId);
    this.customOrderService.customItemOrdersDetails = this.customItemsArray;
  }

  onComplete(form: NgForm) {

    if (!form.valid) {
      return;
    }
    const itemIdList = Object.entries(form.value);

    console.log("ItemList",itemIdList)
    itemIdList.forEach(element => {
      
    })

    itemIdList.forEach(item => {
      const searchedItem = this.customItemsArray.find(arrayItem => arrayItem.itemId === item[0]);
      searchedItem.itemName = item[1].toString();
    });
    console.log("this.customItemsArray", this.customItemsArray);
    this.customOrderService.customItemOrdersDetails = this.customItemsArray;
    this.modalCtrl.dismiss(null, 'confirm', 'customItemModal');
  }

  cancelCustomOrder() {
    this.customOrderService.customItemOrdersDetails = [];
    this.modalCtrl.dismiss(null, 'Custom Order Cancelled', 'customItemModal');
  }

  removeItemSliding(form: NgForm) {

  }

}
