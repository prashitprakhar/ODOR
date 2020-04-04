import { Injectable } from "@angular/core";
import { ICityDetails } from "src/app/models/city-abbreviation-model";
import { environment } from './../../../environments/environment';
import { Plugins } from "@capacitor/core";
import { HttpApiService } from './http-api.service';
import { IUserMobileDetails } from 'src/app/models/user-mobile-details-model';

@Injectable({
  providedIn: "root"
})
export class CommonUtilityService {

  public cityAbbr: ICityDetails[] = [
    {
      abbr: "HYD",
      value: "HYDERABAD"
    },
    {
      abbr: 'BLR',
      value: 'BANGALURU'
    }
  ];

  public userAPI: string = environment.internalAPI.userAuth;

  constructor(private httpAPIService: HttpApiService) {}

  getCityDetails(abbr) {
    return this.cityAbbr.find(element => element.abbr === abbr);
  }

  async getUserMobileDetails(shopId: string): Promise<IUserMobileDetails> {
    const url = `${this.userAPI}getUserMobileDetails`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    // const userId = userDataFetched.userId;
    const userToken = userDataFetched.token;
    const payload = {
      userId: shopId
    };
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async setFCMToken(userId: string, fcmToken: string, userToken: string): Promise<any> {
    const url = `${this.userAPI}setUserMobileDetails`;
    const payload = {
      userId,
      fcmToken
    };
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

}
