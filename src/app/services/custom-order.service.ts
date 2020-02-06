import { Injectable } from "@angular/core";
import { IShopList } from "../models/shop-list.model";
import { IShopData } from '../models/shop-data.model';
import { ShopItemSelectionService } from './shop-item-selection.service';
import { ISelectableItemsOrder } from '../models/selectable-items-orders.model';
import { ICustomOrderItem } from '../models/custom-order-items.model';

@Injectable({
  providedIn: "root"
})
export class CustomOrderService {

  constructor(private shopItemSelectionService: ShopItemSelectionService) {}

  private _customItemOrders: ICustomOrderItem[];

  private _customItemsPacksOrders: ICustomOrderItem[];

  private _selectableItemsOrders: ISelectableItemsOrder[];

  private _isResetAllOrdersNeeded: boolean;

  // private _selectedShopDetails: IShopList;
  private _selectedShopDetails: IShopData;

  private _currentSelectedShopName: string;

  public get currentSelectedShopName(): string {
    return this._currentSelectedShopName;
  }

  public set currentSelectedShopName(value: string) {
    this._currentSelectedShopName = value;
  }

  // public get selectedShopDetails(): IShopList {
  //   return this._selectedShopDetails;
  // }

  // public set selectedShopDetails(value: IShopList) {
  //   this._selectedShopDetails = value;
  // }

  public get selectedShopDetails(): IShopData {
    return this._selectedShopDetails;
  }

  public set selectedShopDetails(value: IShopData) {
    this._selectedShopDetails = value;
  }

  public get isResetAllOrdersNeeded(): boolean {
    return this._isResetAllOrdersNeeded;
  }

  public set isResetAllOrdersNeeded(value: boolean) {
    this._isResetAllOrdersNeeded = value;
  }

  public get selectableItemsOrders(): ISelectableItemsOrder[] {
    return this._selectableItemsOrders;
  }

  public set selectableItemsOrders(value: ISelectableItemsOrder[]) {
    this._selectableItemsOrders = value;
    this.shopItemSelectionService.addOrderedItemsToLocalStorage(this._selectableItemsOrders,
      this._customItemOrders, this._customItemsPacksOrders);
  }

  get customItemsPacksOrdersDetails(): ICustomOrderItem[] {
    return this._customItemsPacksOrders;
  }

  set customItemsPacksOrdersDetails(value: ICustomOrderItem[]) {
    this._customItemsPacksOrders = value;
    this.shopItemSelectionService.addOrderedItemsToLocalStorage(this._selectableItemsOrders,
      this._customItemOrders, this._customItemsPacksOrders);
  }

  get customItemOrdersDetails(): ICustomOrderItem[] {
    return this._customItemOrders;
  }

  set customItemOrdersDetails(orderDetails: ICustomOrderItem[]) {
    this._customItemOrders = orderDetails;
    this.shopItemSelectionService.addOrderedItemsToLocalStorage(this._selectableItemsOrders,
      this._customItemOrders, this._customItemsPacksOrders);
  }

  addLocalStorageItemsToCart(selectableItems: ISelectableItemsOrder[], customItemsPackOrders: ICustomOrderItem[],
                             customItemsKGOrders: ICustomOrderItem[]) {
                               this._customItemOrders = customItemsKGOrders;
                               this._customItemsPacksOrders = customItemsPackOrders;
                               this._selectableItemsOrders = selectableItems;
                             }
}
