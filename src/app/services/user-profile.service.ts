import { Injectable } from '@angular/core';
import { IUserFinalOrder } from '../models/user-final-order.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  public userOrderList: IUserFinalOrder[] = [];

  constructor(private authService: AuthService) { }

  saveUserOrder(userCurrentOrder: IUserFinalOrder) {
    this.userOrderList = [userCurrentOrder, ...this.userOrderList];
  }

  getUserOrder(): IUserFinalOrder[] {
    return [...this.userOrderList] ;
  }

  // getUserProfile() {
  //   this.authService.getAuthState().subscribe(userProfileData => {
  //     console.log("Userprofile Data *****",userProfileData.toJSON());
  //   })
  // }

  // db string -> orderitserviceprivatelimited+jan+2020
  // username -> orderitservice@gmail.com // firebase creds
  // Password -> a82c61f17045a59a5a5c13d6bd16e2ff //MD5 Hash
  // DB url : https://orderitservices.firebaseio.com/
  // Firebase Web API Key - AIzaSyAL4mqXZ-hE9qr1winLtaeGO9kW2BfiVKQ
  // Web App Name : order-it-services

}
