import { Injectable } from '@angular/core';
import { IUserFinalOrder } from '../models/user-final-order.model';
import { AuthService } from './auth.service';
import { from } from 'rxjs';
import { AngularFirestore } from "@angular/fire/firestore";
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  public userOrderList: IUserFinalOrder[] = [];

  constructor(private authService: AuthService,
              private db: AngularFirestore) { }

  saveUserOrder(userCurrentOrder: IUserFinalOrder) {
    this.userOrderList = [userCurrentOrder, ...this.userOrderList];
  }

  getUserOrder(): IUserFinalOrder[] {
    return [...this.userOrderList] ;
  }

  getUserProfile(email: string) {
    return this.db.collection('USER_PROFILE', ref => ref.where('email', '==', email)).valueChanges().pipe(
      take(1)
    );
  }

  // getUserProfile() {
  //   this.authService.getAuthState().subscribe(userProfileData => {
  //     console.log("Userprofile Data *****",userProfileData.toJSON());
  //   })
  // }

  // db string -> orderitserviceprivatelimited+jan+2020
  // username -> orderitservice@gmail.com // firebase creds
  // Password -> !AdOr@20Dec2019
  // Password -> a82c61f17045a59a5a5c13d6bd16e2ff //MD5 Hash
  // DB url : https://orderitservices.firebaseio.com/
  // Firebase Web API Key - AIzaSyAL4mqXZ-hE9qr1winLtaeGO9kW2BfiVKQ
  // Web App Name : order-it-services

}
