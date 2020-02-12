import { Injectable } from "@angular/core";
import { environment } from "./../../../environments/environment";
import { HttpApiService } from "src/app/shared/services/http-api.service";
import { Plugins } from "@capacitor/core";

@Injectable({
  providedIn: "root"
})
export class AdminShopFunctionsService {
  private adminAPI: string = environment.internalAPI.adminFunctions;
  private userAuth: string = environment.internalAPI.userAuth;
  private shopAPI: string = environment.internalAPI.shopFunctions;

  constructor(private httpAPIService: HttpApiService) {}

  createNewShopAccount(
    email,
    password,
    role,
    username,
    securePIN
  ): Promise<any> {
    const payload = {
      username,
      email,
      password,
      role,
      securePIN
    };
    const url = `${this.userAuth}createShopAccount`;
    return this.httpAPIService.postAPI(url, payload);
  }

  async rollBackShopAccountCreation(userId) {
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    // console.log("userDataFetched userDataFetched --- In Logout", userDate);
    const userToken = userDataFetched.token;
    // const header = userToken;
    const url = `${this.userAuth}deleteAccount`;

    const payload = {
      userId
    };

    return this.httpAPIService.deleteAPI(url, payload, userToken);
  }

  createShopProfile(shopProfile): Promise<any> {
    const url = `${this.shopAPI}createShopProfile`;
    return this.httpAPIService.postAPI(url, shopProfile);
  }

  /*
signup(username, email, password, role) {
    const payload = {
      username,
      email,
      password,
      role
    };
    return from(this.http.post(`${this.userAuthAPI}signup`, payload)).pipe(
      take(1),
      // tap(this.setUserData.bind(this)),
      // tap(this.createUserProfile.bind(this))
    );
  }
  */

  // async addShopOfferedNewItem(itemDetails): Promise<any> {
  //   // addShopItems
  //   const userData = await Plugins.Storage.get({ key: "authData" });
  //   const userDataFetched = JSON.parse(userData.value);
  //   // console.log("userDataFetched userDataFetched --- In Logout", userDate);
  //   const userToken = userDataFetched.token;
  //   const payload = {
  //     shopId: userDataFetched.userId,
  //     itemName: itemDetails.itemName,
  //     itemBrand: itemDetails.itemBrand,
  //     itemDescription: itemDetails.itemDescription,
  //     itemCategory: itemDetails.itemCategory,
  //     itemUndiscountedRate: itemDetails.itemUndiscountedRate,
  //     itemWeight: itemDetails.itemWeight,
  //     itemUnit: itemDetails.itemUnit,
  //     isDiscountedAvailable: itemDetails.isDiscountedAvailable,
  //     itemDiscountedRate: itemDetails.itemDiscountedRate,
  //     discountAmount: itemDetails.discountAmount,
  //     discountPercentage: itemDetails.discountPercentage,
  //     itemCount: itemDetails.itemCount,
  //     itemAvailable: itemDetails.itemAvailable,
  //     itemImageUrl: itemDetails.itemImageUrl
  //   };

  //   const url = `${this.adminAPI}addShopItems`;
  //   return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  // }
}
