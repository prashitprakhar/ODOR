import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomOrderService {

  constructor() { }

   private _customItemOrders: any[];

   private _customItemsPacksOrders: any[];

   private _selectableItemsOrders: any[];

  public get selectableItemsOrders(): any[] {
    return this._selectableItemsOrders;
  }
  public set selectableItemsOrders(value: any[]) {
    this._selectableItemsOrders = value;
  }

  get customItemsPacksOrdersDetails(): any[] {
    return this._customItemsPacksOrders;
  }
  set customItemsPacksOrdersDetails(value: any[]) {
    this._customItemsPacksOrders = value;
  }

   get customItemOrdersDetails(): any[] {
     return this._customItemOrders;
   }

   set customItemOrdersDetails(orderDetails: any[]) {
    this._customItemOrders = orderDetails;
   }

}
