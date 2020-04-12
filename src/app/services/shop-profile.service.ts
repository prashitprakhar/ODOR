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
}
