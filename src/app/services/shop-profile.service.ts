import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";

import { environment } from "./../../environments/environment";
import { HttpApiService } from "../shared/services/http-api.service";

@Injectable({
  providedIn: "root",
})
export class ShopProfileService {
  public shopEndPoint = environment.internalAPI.shopFunctions;

  constructor(
    private httpAPIService: HttpApiService
  ) {}

  async getActiveOrders(): Promise<any> {
    const url = `${this.shopEndPoint}getAllOrders`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {
      shopId: userId
    };
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async changeOrderStatus(userId, orderId, orderStatus: string, previousOrderStatus: string): Promise<any> {
    const url = `${this.shopEndPoint}changeOrderStatus`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const shopId = userDataFetched.userId;
    const payload = {
      shopId,
      userId,
      orderId,
      orderStatus,
      previousOrderStatus
    };
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async changePaymentStatus(userId, orderId, orderStatus: boolean, previousOrderStatus: boolean): Promise<any> {
    const url = `${this.shopEndPoint}paymentComplete`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const shopId = userDataFetched.userId;
    const payload = {
      shopId,
      userId,
      orderId,
      orderStatus,
      previousOrderStatus
    };
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async getAllOrdersForShop(): Promise<any> {
    const url = `${this.shopEndPoint}getAllOrders`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const shopId = userDataFetched.userId;
    const payload = {
      shopId
    };
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async getCompletedOrders(): Promise<any> {
    const url = `${this.shopEndPoint}getCompletedOrders`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const shopId = userDataFetched.userId;
    const payload = {
      shopId
    };
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }
}
