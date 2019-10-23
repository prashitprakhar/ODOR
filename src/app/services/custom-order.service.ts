import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomOrderService {

  constructor() { }

   private _customItemOrders: any[];

   private _customItemsPacksOrders: any[];

  get customItemsPacksOrdersDetails(): any[] {
    return this._customItemsPacksOrders;
  }
  set customItemsPacksOrdersDetails(value: any[]) {
    this._customItemsPacksOrders = value;
  }

   get customItemOrdersDetails() {
     return this._customItemOrders;
   }

   set customItemOrdersDetails(orderDetails) {
    this._customItemOrders = orderDetails;
   }

}
