import { Injectable } from '@angular/core';
import { IUserFinalOrder } from '../models/user-final-order.model';
import { AuthService } from './auth.service';
// import { from } from 'rxjs';
import { AngularFirestore } from "@angular/fire/firestore";
import { take, map } from 'rxjs/operators';
import { ICustomerAddress } from '../models/customer-address.model';
import { environment } from 'src/environments/environment';
import { Plugins } from "@capacitor/core";
import { HttpApiService } from '../shared/services/http-api.service';
import { ICustomerProfileDetails } from '../models/customer-profile-details.model';
import { BehaviorSubject } from 'rxjs';
// import { ICustomOrderItem } from '../models/custom-order-items.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private userAPI: string = environment.internalAPI.userAuth;
  public userOrderList: IUserFinalOrder[] = [];
  // public _customerCurrentOrder = new BehaviorSubject<IUserFinalOrder>(null);
  // private _shopList = new BehaviorSubject<IShopData[]>(null);

  constructor(
    // private authService: AuthService,
              private db: AngularFirestore,
              private httpAPIService: HttpApiService) { }

  async saveUserOrder(userCurrentOrder: IUserFinalOrder): Promise<any> {
    this.userOrderList = [];
    this.userOrderList = [userCurrentOrder];
    // console.log("userCurrentOrder userCurrentOrder >>>>>", userCurrentOrder);
    const url = `${this.userAPI}placeOrder`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {userId, orderDetails: userCurrentOrder};
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  getUserOrder(): IUserFinalOrder[] {
    return [...this.userOrderList] ;
  }

  async getCustomerAllOrder(): Promise<IUserFinalOrder[]> {
    // return [...this.userOrderList] ;
    const url = `${this.userAPI}getAllOrders`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {userId};
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async getCustomerCurrentOrder(): Promise<IUserFinalOrder> {
    const url = `${this.userAPI}customerCurrentOrder`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {userId};
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  // get getCustomerOrders() {
  //   // this._customerCurrentOrder.subscribe(data => {});
  //   // return this._customerCurrentOrder.asObservable();
  //   return this._customerCurrentOrder.asObservable().pipe(
  //     take(1),
  //     map(customerOrder => {
  //       if (customerOrder) {
  //         console.log("customerOrder", customerOrder);
  //         return customerOrder;
  //       } else {
  //         return null;
  //       }
  //       // if (user) {
  //       //   return user.id;
  //       // } else {
  //       //   return null;
  //       // }
  //     })
  //   );
  // }

  // getUserProfile(email: string) {
  //   return this.db.collection('USER_PROFILE', ref => ref.where('email', '==', email)).valueChanges().pipe(
  //     take(1)
  //   );
  // }

  async getAndSetCustomerProfile(): Promise<ICustomerProfileDetails> {
    const userProfile = await this.getCustomerProfile();
    const customerDetails = JSON.stringify({
      customerRating: userProfile.customerRating,
      customerAddressList: userProfile.customerAddressList,
      customerImageUrl: userProfile.customerImageUrl
    });

    await Plugins.Storage.set({ key: 'customerProfileDetails', value: customerDetails});

    return userProfile;
  }

  async getCustomerProfile(): Promise<ICustomerProfileDetails> {
    const url = `${this.userAPI}getCustomerProfile`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {userId};
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
    // getCustomerProfile
  }

  async getCurrentlyUsedAddress(): Promise<ICustomerAddress> {
    const customerProfileData = await Plugins.Storage.get({ key: 'customerProfileDetails'});
    const customerProfileParsedData = JSON.parse(customerProfileData.value);
    const customerCurrentlyUsedAddress: ICustomerAddress = customerProfileParsedData.customerAddressList
                                                              .find(element => element.isCurrentlyUsed === true);
    return customerCurrentlyUsedAddress;
  }

  async addNewAddress(addressDetails: ICustomerAddress): Promise<any> {
    const url = `${this.userAPI}addNewAddress`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {...addressDetails, userId};
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async getCustomerSavedAddresses(): Promise<any> {
    const url = `${this.userAPI}customerSavedAddress`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {userId};
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async getCustomerSavedAddressListFromLocalStorage(): Promise<ICustomerAddress[]> {
    const customerSavedProfile = await Plugins.Storage.get({ key: 'customerProfileDetails'});
    const parsedCustomerProfile = JSON.parse(customerSavedProfile.value);
    const customerSavedAddressList = parsedCustomerProfile.customerAddressList;
    return customerSavedAddressList;
  }

  // async getCustomerSavedAddresses(): Observable<any> {
  //   const url = `${this.userAPI}customerSavedAddress`;
  //   const userData = await Plugins.Storage.get({ key: "authData" });
  //   const userDataFetched = JSON.parse(userData.value);
  //   const userToken = userDataFetched.token;
  //   const userId = userDataFetched.userId;
  //   const payload = {userId};
  //   return from(this.httpAPIService.authenticatedPostAPI(url, payload, userToken)).asObservable();
  // }

  async updateAddressUsageFlag(_id): Promise<any> {
    const url = `${this.userAPI}updateUsageFlag`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {userId, _id};
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async editAddressDetails(addressDetails: ICustomerAddress, _id): Promise<any> {
    const url = `${this.userAPI}editAddressDetails`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {...addressDetails, userId, _id};
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async deleteAddress(_id) : Promise<any> {
    const url = `${this.userAPI}deleteAddress`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = {userId, _id};
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  // getUserProfile() {
  //   this.authService.getAuthState().subscribe(userProfileData => {
  //     console.log("Userprofile Data *****",userProfileData.toJSON());
  //   })
  // }

  // db string -> orderitserviceprivatelimited+jan+2020
  // username -> orderitservice@gmail.com // firebase creds
  // @sendgrid/email - login - support@indilligence.com
  // @sendgrid/email - username - orderitservices
  // @sendgrid/email - password
  // API Key Name - orderitservicesapikey
  // API key - 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
  // API Key ID: 805x_HtZQ9mlT8bLilTQ-w
  // Password -> !AdOr@20Dec2019
  // PIN - "628464"
  // Password -> a82c61f17045a59a5a5c13d6bd16e2ff //MD5 Hash

  // DB url : https://orderitservices.firebaseio.com/
  // Firebase Web API Key - AIzaSyAL4mqXZ-hE9qr1winLtaeGO9kW2BfiVKQ
  // Web App Name : order-it-services
  // tslint:disable-next-line: max-line-length
  // FCM Device Token (My Android Device Nokia 8.1) - dh0cQiSUj_Y:APA91bGwljiA94hz1OAd2f4wtMcu3RpplT5ezf5QXqg7J_MPE9PpAVcHQFy5y2w5kf0JQAN4-xECbbUkORkLlXV8mel4pAuV4rdoYXyG6D_5UICFOQ95YdBicZFLMd9GhNipJQ7IYoyn

  // Shop - mahalakshmikiranastore@gmail.com

}
