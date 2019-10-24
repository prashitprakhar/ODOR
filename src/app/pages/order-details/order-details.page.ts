import { Component, OnInit } from '@angular/core';
import { CustomOrderService } from 'src/app/services/custom-order.service';
import { ICustomOrderItem } from 'src/app/models/custom-order-items.model';
import { ISelectableItemsOrder } from 'src/app/models/selectable-items-orders.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  public customOrdersPacks: ICustomOrderItem[] = [];
  public customOrdersKG: ICustomOrderItem[] = [];
  public selectableOrders: ISelectableItemsOrder[] = [];
  public grandTotal: number = 0;

  constructor(private customOrderService: CustomOrderService) { }

  ionViewWillEnter() {
    this.customOrdersPacks = this.customOrderService.customItemsPacksOrdersDetails;
    this.customOrdersKG = this.customOrderService.customItemOrdersDetails;
    this.selectableOrders = this.customOrderService.selectableItemsOrders;
    // tslint:disable-next-line: only-arrow-functions
    if(this.selectableOrders){
      this.grandTotal = this.selectableOrders.reduce(function(accumulator, item) {
        return accumulator + item.totalPrice;
      }, 0);
    }
    //console.log("Grand Total *****", this.grandTotal);
    /*
    var totalYears = pilots.reduce(function (accumulator, pilot) {
  return accumulator + pilot.years;
}, 0);
    */
    //console.log("this.selectableOrders", this.selectableOrders);
  }

  ionViewDidEnter() {
    this.customOrdersPacks = this.customOrderService.customItemsPacksOrdersDetails;
    this.customOrdersKG = this.customOrderService.customItemOrdersDetails;
    this.selectableOrders = this.customOrderService.selectableItemsOrders;
    // tslint:disable-next-line: only-arrow-functions
    if(this.selectableOrders){
    this.grandTotal = this.selectableOrders.reduce(function(accumulator, item) {
      return accumulator + item.totalPrice;
    }, 0);
  }
    //console.log("Grand Total *****", this.grandTotal);
    /*
    var totalYears = pilots.reduce(function (accumulator, pilot) {
  return accumulator + pilot.years;
}, 0);
    */
    //console.log("this.selectableOrders", this.selectableOrders);
  }

  ngOnInit() {
//     this.customOrdersPacks = this.customOrderService.customItemsPacksOrdersDetails;
//     this.customOrdersKG = this.customOrderService.customItemOrdersDetails;
//     this.selectableOrders = this.customOrderService.selectableItemsOrders;
//     // tslint:disable-next-line: only-arrow-functions
//     this.grandTotal = this.selectableOrders.reduce(function(accumulator, item) {
//       return accumulator + item.totalPrice;
//     }, 0);

//     console.log("Grand Total *****", this.grandTotal);
//     /*
//     var totalYears = pilots.reduce(function (accumulator, pilot) {
//   return accumulator + pilot.years;
// }, 0);
//     */
//     console.log("this.selectableOrders", this.selectableOrders);
  }

  

}
