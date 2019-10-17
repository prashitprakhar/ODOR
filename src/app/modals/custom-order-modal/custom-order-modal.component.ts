import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

export interface ICustomItem {
  itemId: string;
  itemName: string;
  itemQuantity: number;
  itemCount: number;
}

@Component({
  selector: 'app-custom-order-modal',
  templateUrl: './custom-order-modal.component.html',
  styleUrls: ['./custom-order-modal.component.scss'],
})
export class CustomOrderModalComponent implements OnInit {

  public customItemsCount: number = 0;
  public customItemsArray: ICustomItem[] = [
    {
      itemId: 'item1',
      itemName: '',
      itemQuantity: 0,
      itemCount: 0
    }
  ];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onClose() {
    this.modalCtrl.dismiss(null, 'cancel', 'customItemModal')
  }

  addNewItem() {
    ++this.customItemsCount;

  }

  increment(itemId){
    console.log("Item ID increment")
    let customItem = this.customItemsArray.find(item => item.itemId === itemId);
    customItem.itemCount++;
    console.log("Item Count***",customItem.itemCount);
  }

  onComplete() {
    this.modalCtrl.dismiss({message : 'Passing data back from modal'}, 'confirm', 'customItemModal')
  }

}
