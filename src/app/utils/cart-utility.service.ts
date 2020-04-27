import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { environment } from "./../../environments/environment";
import { CustomOrderService } from "../services/custom-order.service";
import { ICustomOrderItem } from "../models/custom-order-items.model";
import { HttpApiService } from "../shared/services/http-api.service";
import { ISelectableItemsOrder } from "../models/selectable-items-orders.model";
import { ShopItemSelectionService } from "../services/shop-item-selection.service";

@Injectable({
  providedIn: "root"
})
export class CartUtilityService {
  private userAPI: string = environment.internalAPI.userAuth;
  // private selectableCartItems: ICustomOrderItem;
  // private customKGCartItems: ICustomOrderItem;
  // private customPacksCartItems: ICustomOrderItem;
  private hasLocalStorageCartItem: boolean = false;

  constructor(
    private customOrderService: CustomOrderService,
    private shopItemSelectionService: ShopItemSelectionService,
    private httpAPIService: HttpApiService
  ) {}

  hasLocalStorageCartItems(): boolean {
    if (this.customOrderService.selectableItemsOrders) {
      this.customOrderService.selectableItemsOrders.length > 0
        ? (this.hasLocalStorageCartItem = true)
        : (this.hasLocalStorageCartItem = false);
    }
    if (this.customOrderService.customItemOrdersDetails) {
      this.customOrderService.customItemOrdersDetails.length > 0
        ? (this.hasLocalStorageCartItem = true)
        : (this.hasLocalStorageCartItem =
            false || this.hasLocalStorageCartItem);
    }

    if (this.customOrderService.customItemsPacksOrdersDetails) {
      this.customOrderService.customItemsPacksOrdersDetails.length > 0
        ? (this.hasLocalStorageCartItem = true)
        : (this.hasLocalStorageCartItem =
            false || this.hasLocalStorageCartItem);
    }
    return this.hasLocalStorageCartItem;
  }

  async onLoginUpdateDBCartsWhenLocalStorageItemsAvailable(): Promise<any[]> {
    const selectableItems = this.customOrderService.selectableItemsOrders;
    const customPackItems = this.customOrderService
      .customItemsPacksOrdersDetails;
    const customKGItems = this.customOrderService.customItemOrdersDetails;

    const url = `${this.userAPI}updateCartsOnLogin`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    // console.log("userDataFetched userDataFetched --- In Logout", userDate);
    const userId = userDataFetched.userId;
    const userToken = userDataFetched.token;
    const payload = {
      userId,
      selectableItems,
      customPackItems,
      customKGItems
    };
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async updateSelectableItemsAsPerAvailabilityCurrently(
    selectableItems: ISelectableItemsOrder[]
  ): Promise<ISelectableItemsOrder[]> {
    if (selectableItems.length > 0) {
      const shopId = selectableItems[0].shopId;
      const shopData = await this.shopItemSelectionService.getShopOfferedItemsForCustomers(
        shopId
      );
      // console.log("SHOP Data ********", shopData);
      const availableShopOfferedItems: ISelectableItemsOrder[] = [];
      selectableItems.forEach(eachSelectableCartItem => {
        const cartItem = shopData.shopOfferedItemsList.find(
          element => {
            return (element._id === eachSelectableCartItem._id && element.itemAvailable)
          }
        );
        if (cartItem) {
          availableShopOfferedItems.push(eachSelectableCartItem);
        }
      });
      // console.log(
      //   "availableShopOfferedItems availableShopOfferedItems >>>>>",
      //   availableShopOfferedItems
      // );
      return availableShopOfferedItems;
    } else {
      return [];
    }
  }

}
