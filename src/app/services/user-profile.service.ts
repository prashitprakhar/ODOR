import { Injectable } from '@angular/core';
import { IUserFinalOrder } from '../models/user-final-order.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  public userOrderList: IUserFinalOrder[] = [];

  constructor() { }

  saveUserOrder(userCurrentOrder: IUserFinalOrder) {
    this.userOrderList = [userCurrentOrder, ...this.userOrderList];
    // console.log("this.userOrderList",this.userOrderList)
  }

  getUserOrder(): IUserFinalOrder[] {
    return [...this.userOrderList] ;
  }

}
