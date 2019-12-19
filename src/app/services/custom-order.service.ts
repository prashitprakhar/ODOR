import { Injectable } from "@angular/core";
import { IShopList } from "../models/shop-list.model";

@Injectable({
  providedIn: "root"
})
export class CustomOrderService {

  constructor() {}

  private _customItemOrders: any[];

  private _customItemsPacksOrders: any[];

  private _selectableItemsOrders: any[];

  private _isResetAllOrdersNeeded: boolean;

  private _selectedShopDetails: IShopList;

  private _currentSelectedShopName: string;

  public get currentSelectedShopName(): string {
    return this._currentSelectedShopName;
  }

  public set currentSelectedShopName(value: string) {
    this._currentSelectedShopName = value;
  }

  public get selectedShopDetails(): IShopList {
    return this._selectedShopDetails;
  }

  public set selectedShopDetails(value: IShopList) {
    this._selectedShopDetails = value;
  }

  public get isResetAllOrdersNeeded(): boolean {
    return this._isResetAllOrdersNeeded;
  }

  public set isResetAllOrdersNeeded(value: boolean) {
    this._isResetAllOrdersNeeded = value;
  }

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
