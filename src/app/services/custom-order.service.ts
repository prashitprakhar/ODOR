import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomOrderService {

  constructor() { }

   private _customItemOrders: any[];

   get customItemOrdersDetails() {
     return this._customItemOrders;
   }

   set customItemOrdersDetails(orderDetails) {
    this._customItemOrders = orderDetails;
   }

}
