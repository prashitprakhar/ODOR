import { Component, OnInit } from '@angular/core';
import { CustomOrderService } from 'src/app/services/custom-order.service';
import { ICustomOrderItem } from 'src/app/models/custom-order-items.model';
import { ISelectableItemsOrder } from 'src/app/models/selectable-items-orders.model';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { IUserFinalOrder } from 'src/app/models/user-final-order.model';
import { IShopList } from 'src/app/models/shop-list.model';
import { DeliveryTimeService } from 'src/app/services/delivery-time.service';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { Router } from '@angular/router';
import { OrderConfirmedModalComponent } from 'src/app/modals/order-confirmed-modal/order-confirmed-modal.component';

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
  public userFinalOrder: IUserFinalOrder;
  public selectedShopDetails: IShopList;
  public isOrderUnplaced: boolean = false;
  public selectedShopName: string;
  public hasCustomOrders: boolean = false;
  public currentHour: number;
  public deliveryHour: number;
  public currentMin: string;
  public currentDate: number;
  public currentMonth: string;
  public currentYear: number;
  public deliveryDateTime: string;

  constructor(private customOrderService: CustomOrderService,
              private actionSheetCtrl: ActionSheetController,
              private deliveryTimeService: DeliveryTimeService,
              private userProfileService: UserProfileService,
              // private router: Router,
              private orderConfModalCtrl: ModalController) { }

  ngOnInit() {
    this.selectableOrders = [];
  }

  ionViewWillEnter() {
    const dateObj = new Date();
    this.currentDate = dateObj.getDate();
    const currentMinute = dateObj.getMinutes();
    if (currentMinute < 10) {
      this.currentMin = `0${currentMinute}`;
    } else {
      this.currentMin = `${currentMinute}`;
    }
    this.currentYear = dateObj.getFullYear();
    this.deliveryHour = this.hourConverter();
    this.currentMonth = this.monthConverter(dateObj.getMonth());
    // tslint:disable-next-line: max-line-length
    this.deliveryDateTime = `${this.deliveryHour}:${this.currentMin} ${this.amPmTracker()}, ${this.currentDate} ${this.currentMonth} ${this.currentYear}`;

    this.allOrdersCombined = [];
    this.selectedShopName = this.customOrderService.currentSelectedShopName;
    const allOrders = this.userProfileService.getUserOrder();
    const openOrder = allOrders.length > 0 ? allOrders.find(element => element.orderPlaced === false) : true;
    this.isOrderUnplaced = true;
    this.allOrdersCombined = [];
    this.customOrdersPacks = this.customOrderService.customItemsPacksOrdersDetails;
    this.customOrdersKG = this.customOrderService.customItemOrdersDetails;
    this.selectableOrders = this.customOrderService.selectableItemsOrders;
    if (this.customOrderService.customItemOrdersDetails) {
      this.hasCustomOrders = true;
      this.allOrdersCombined = [...this.allOrdersCombined, ...this.customOrderService.customItemOrdersDetails];
    }
    if (this.customOrderService.customItemsPacksOrdersDetails) {
      this.hasCustomOrders = true;
      this.allOrdersCombined = [...this.allOrdersCombined, ...this.customOrderService.customItemsPacksOrdersDetails];
    }
    if (this.customOrderService.selectableItemsOrders) {
      this.allOrdersCombined = [...this.allOrdersCombined, ...this.selectableOrders];
    }
    const checkCustomItems = this.allOrdersCombined.find(element => element.orderType === 'CUSTOM');
    if (checkCustomItems) {
      this.hasCustomOrders = true;
    } else {
      this.hasCustomOrders = false;
    }
    if (this.selectableOrders) {
      // tslint:disable-next-line: only-arrow-functions
      this.grandTotal = this.selectableOrders.reduce(function(accumulator, item) {
        return accumulator + item.totalPrice;
      }, 0);
    }
  }

  hourConverter(): number {
    const dateObj = new Date();
    const currentHour = dateObj.getHours() + 1;
    let twelveHourFormatDate = 0;
    if (currentHour <= 12) {
      twelveHourFormatDate = currentHour;
    } else {
      twelveHourFormatDate = currentHour - 12;
    }
    return twelveHourFormatDate;
  }

  amPmTracker(): string {
    const dateObj = new Date();
    const currentHour = dateObj.getHours() + 1;
    let amPmText = '';
    if (currentHour <= 12) {
      amPmText = 'AM';
    } else {
      amPmText = 'PM';
    }
    return amPmText;
  }

  monthConverter(monthNumber): string {
    let monthText = "";
    switch (monthNumber) {
      case 0:
        monthText = "Jan";
        break;
      case 1:
        monthText = "Feb";
        break;
      case 2:
        monthText = "Mar";
        break;
      case 3:
        monthText = "Apr";
        break;
      case 4:
        monthText = "May";
        break;
      case 5:
        monthText = "Jun";
        break;
      case 6:
        monthText = "Jul";
        break;
      case 7:
        monthText = "Aug";
        break;
      case 8:
        monthText = "Sep";
        break;
      case 9:
        monthText = "Oct";
        break;
      case 10:
        monthText = "Nov";
        break;
      case 11:
        monthText = "Dec";
        break;
    }
    return monthText;
  }

  // ionViewDidEnter() {
  //   console.log("ionViewDidEnter");
  //   const allOrders = this.userProfileService.getUserOrder();
  //   const openOrder = allOrders.length > 0 ? allOrders.find(element => element.orderPlaced === false) : true;
  //   // if (openOrder) {
  //   this.allOrdersCombined = [];
  //   this.customOrdersPacks = this.customOrderService.customItemsPacksOrdersDetails;
  //   this.customOrdersKG = this.customOrderService.customItemOrdersDetails;
  //   this.selectableOrders = this.customOrderService.selectableItemsOrders;
  //   if (this.customOrderService.customItemOrdersDetails) {
  //     this.allOrdersCombined = [...this.allOrdersCombined, ...this.customOrderService.customItemOrdersDetails];
  //   }
  //   if (this.customOrderService.customItemsPacksOrdersDetails) {
  //     this.allOrdersCombined = [...this.allOrdersCombined, ...this.customOrderService.customItemsPacksOrdersDetails];
  //   }
  //   if (this.customOrderService.selectableItemsOrders) {
  //     this.allOrdersCombined = [...this.allOrdersCombined, ...this.selectableOrders];
  //   }
  //   // this.allOrdersCombined = [...this.customOrdersPacks, ...this.customOrdersKG, ...this.selectableOrders]
  //   if (this.selectableOrders) {
  //     // tslint:disable-next-line: only-arrow-functions
  //     this.grandTotal = this.selectableOrders.reduce(function(accumulator, item) {
  //       return accumulator + item.totalPrice;
  //     }, 0);
  //   }
  // // } else {
  // //   this.isOrderUnplaced = false;
  // // }
  // }

  placeOrder() {
    if (this.customOrderService.customItemOrdersDetails && this.customOrderService.customItemsPacksOrdersDetails) {
      if (this.customOrderService.customItemOrdersDetails.length > 0 || this.customOrderService.customItemsPacksOrdersDetails.length > 0) {
        this.actionSheetCtrl.create({
          header: 'Place Order',
          // tslint:disable-next-line: max-line-length
          subHeader: 'You have custom orders in your cart. We will confirm the estimated price for the custom items once the items are picked. The Grand total shown is only for the selected items offered by the Shop.',
          buttons: [
            {
              text: 'Ok. Got it. Place Order.',
              handler: () => {
                this.confirmOrder();
              }
            }
          ]
        }).then(actionSheetEl => {
          actionSheetEl.present();
        });
      } else {
        this.confirmOrder();
      }
    } else {
      this.confirmOrder();
    }
  }

  confirmOrder() {
    this.selectedShopDetails = this.customOrderService.selectedShopDetails;
    this.customOrderService.isResetAllOrdersNeeded = true;
    const randomInteger = Math.floor(Math.random() * 1299827);
    const date = new Date();
    this.userFinalOrder = {
      orderId: this.allOrdersCombined[0].shopId + '-' + randomInteger,
      shopId: this.allOrdersCombined[0].shopId,
      shopName: this.selectedShopDetails.shopName,
      ordersList: this.allOrdersCombined,
      selectedItemsTotalPrice: this.grandTotal,
      customItemsEstimatedPrice: 0,
      estimatedDeliveryTime: this.deliveryTimeService.getManipulatedDeliveryTime().deliveryTimeWithin1K + 'mins',
      estimatedDeliveryDateTimeFull: this.deliveryDateTime,
      deliveryAddress: 'Test Address',
      deliveryDate: date,
      deliveryTimeSlot: 'within 30 minutes',
      deliveryCharge: 'Free',
      maxDistance: 1 + ' KM.',
      orderPlaced: true,
      orderStatus: 'PROGRESS',
      orderConfirmationStatus: 'WAITING'
    };
    this.userProfileService.saveUserOrder(this.userFinalOrder);
    this.orderConfModalCtrl
    .create({
      component: OrderConfirmedModalComponent,
      componentProps: {
        name: "orderConfModal",
        orderId: this.userFinalOrder.orderId
      },
      id: "orderConfModal"
    })
    .then(orderConfModalEl => {
      orderConfModalEl.present();
      return orderConfModalEl.onDidDismiss();
    })
    .then(data => {
      this.isOrderUnplaced = false;
      this.customOrderService.customItemsPacksOrdersDetails = [];
      this.customOrderService.customItemOrdersDetails = [];
      this.customOrderService.selectableItemsOrders = [];
      this.selectableOrders = [];
    });
  }

}
