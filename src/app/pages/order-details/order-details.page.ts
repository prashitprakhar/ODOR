import { Component, OnInit } from '@angular/core';
import { CustomOrderService } from 'src/app/services/custom-order.service';
import { ICustomOrderItem } from 'src/app/models/custom-order-items.model';
import { ISelectableItemsOrder } from 'src/app/models/selectable-items-orders.model';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  public customOrdersPacks: ICustomOrderItem[] = [];
  public customOrdersKG: ICustomOrderItem[] = [];
  public selectableOrders: ISelectableItemsOrder[] = [];
  public allOrdersCombined: ICustomOrderItem[] = [];
  public grandTotal: number = 0;

  constructor(private customOrderService: CustomOrderService,
              private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.selectableOrders = [];
  }

  ionViewWillEnter() {
    this.allOrdersCombined = [];
    this.customOrdersPacks = this.customOrderService.customItemsPacksOrdersDetails;
    this.customOrdersKG = this.customOrderService.customItemOrdersDetails;
    this.selectableOrders = this.customOrderService.selectableItemsOrders;
    if (this.customOrderService.customItemsPacksOrdersDetails) {
      this.allOrdersCombined = [...this.allOrdersCombined, ...this.customOrderService.customItemsPacksOrdersDetails];
    }
    if (this.customOrderService.customItemOrdersDetails) {
      this.allOrdersCombined = [...this.allOrdersCombined, ...this.customOrderService.customItemOrdersDetails];
    }
    if (this.customOrderService.selectableItemsOrders) {
      this.allOrdersCombined = [...this.allOrdersCombined, ...this.selectableOrders];
    }
    // this.allOrdersCombined = [...this.customOrdersPacks, ...this.customOrdersKG, ...this.selectableOrders]
    if (this.selectableOrders) {
      // tslint:disable-next-line: only-arrow-functions
      this.grandTotal = this.selectableOrders.reduce(function(accumulator, item) {
        return accumulator + item.totalPrice;
      }, 0);
    }
  }

  ionViewDidEnter() {
    this.allOrdersCombined = [];
    this.customOrdersPacks = this.customOrderService.customItemsPacksOrdersDetails;
    this.customOrdersKG = this.customOrderService.customItemOrdersDetails;
    this.selectableOrders = this.customOrderService.selectableItemsOrders;
    if (this.customOrderService.customItemsPacksOrdersDetails) {
      this.allOrdersCombined = [...this.allOrdersCombined, ...this.customOrderService.customItemsPacksOrdersDetails];
    }
    if (this.customOrderService.customItemOrdersDetails) {
      this.allOrdersCombined = [...this.allOrdersCombined, ...this.customOrderService.customItemOrdersDetails];
    }
    if (this.customOrderService.selectableItemsOrders) {
      this.allOrdersCombined = [...this.allOrdersCombined, ...this.selectableOrders];
    }
    // this.allOrdersCombined = [...this.customOrdersPacks, ...this.customOrdersKG, ...this.selectableOrders]
    if (this.selectableOrders) {
      // tslint:disable-next-line: only-arrow-functions
      this.grandTotal = this.selectableOrders.reduce(function(accumulator, item) {
        return accumulator + item.totalPrice;
      }, 0);
    }
  }

  placeOrder() {
    console.log("Place Order");
    this.actionSheetCtrl.create({
      header: 'Place Order',
      subHeader: 'You have custom orders in your cart. We will confirm the estimated price for the custom items once the items are picked. The Grand total shown is only for the selected items offered by the Shop.',
      cssClass: 'title_class',
      buttons: [
        {
          text: 'Ok. Got it. Order now.',
          handler: () => {
            this.confirmOrder();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    })
  }

  confirmOrder() {
    console.log("Order Confirmed")
  }

}
