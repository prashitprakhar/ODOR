import { Injectable } from '@angular/core';
import { IShopList } from './../models/shop-list.model';
import { IShopOfferedItems } from '../models/shop-offered-items.model';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopItemSelectionService {

  private _shopList = new BehaviorSubject<IShopList[]>([
    {
      shopId: "SUDARSHANNAGARSHOP1",
      shopName: 'Maha Lakshmi Kirana & General Store',
      shopType: "GROCERY",
      shopLocation: "SUDARSHAN NAGAR COLONY",
      shopAddress: "SUDARSHAN NAGAR COLONY",
      shopPostalCode: 500032,
      shopImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y',
      shopRating: 4.5,
      userId: '0YFzC3NLQwafa78cKc92dU6X9i52',
      firstOrderTime: '7 AM',
      lastOrderTime: '10 PM',
      isShopOpen: true,
      shopOfferedItemsList : [
        {
          itemId: 'MILK1',
          itemName: 'Jersey Milk',
          itemBrand: 'Jersey',
          itemDescription: 'Packaged Milk Tetra Pack',
          itemCategory: 'Packaged',
          itemUndiscountedRate: 10,
          isDiscountedAvailable: false,
          itemDiscountedRate: 10,
          discountAmount: 0,
          discountPercentage: 0,
          itemWeight: 100,
          itemUnit: 'g',
          itemCount: 0,
          itemAvailable: false,
          itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
        },
        {
          itemId: 'MILK2',
          itemName: 'Jersey Milk',
          itemBrand: 'Jersey',
          itemDescription: 'Packaged Milk Tetra Pack',
          itemCategory: 'Packaged',
          itemUndiscountedRate: 10,
          isDiscountedAvailable: false,
          itemDiscountedRate: 10,
          discountAmount: 0,
          discountPercentage: 0,
          itemCount: 0,
          itemWeight: 100,
          itemUnit: 'g',
          itemAvailable: true,
          itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
        },
        {
          itemId: 'MILK3',
          itemName: 'Jersey Milk',
          itemBrand: 'Jersey',
          itemDescription: 'Packaged Milk Tetra Pack',
          itemCategory: 'Packaged',
          itemUndiscountedRate: 10,
          isDiscountedAvailable: false,
          itemDiscountedRate: 10,
          discountAmount: 0,
          discountPercentage: 0,
          itemCount: 0,
          itemWeight: 100,
          itemUnit: 'g',
          itemAvailable: true,
          itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
        },
        {
          itemId: 'MILK4',
          itemName: 'Jersey Milk',
          itemBrand: 'Jersey',
          itemDescription: 'Packaged Milk Tetra Pack',
          itemCategory: 'Packaged',
          itemUndiscountedRate: 10,
          isDiscountedAvailable: false,
          itemDiscountedRate: 10,
          discountAmount: 0,
          discountPercentage: 0,
          itemCount: 0,
          itemWeight: 100,
          itemUnit: 'g',
          itemAvailable: true,
          itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
        }
      ]
    }
    // {
    //   shopId: "NALLAGANDALASHOP1",
    //   shopName: 'Regent Park General Store',
    //   shopType: "GROCERY",
    //   shopLocation: "REGENT PARK APARTMENT",
    //   shopAddress: "REGENT PARK APARTMENT",
    //   shopPostalCode: 500019,
    //   shopImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y',
    //   shopRating: 4.5,
    //   userId: 'testUser1',
    //   firstOrderTime: '7 AM',
    //   lastOrderTime: '10 PM',
    //   isShopOpen: true,
    //   shopOfferedItemsList : [
    //     {
    //       itemId: 'MILK1',
    //       itemName: 'Mother Dairy Milk',
    //       itemBrand: 'Mother Dairy',
    //       itemDescription: 'Packaged Milk Tetra Pack',
    //       itemCategory: 'Packaged',
    //       itemUndiscountedRate: 10,
    //       itemWeight: 100,
    //       itemUnit: 'g',
    //       isDiscountedAvailable: false,
    //       itemDiscountedRate: 10,
    //       discountAmount: 0,
    //       discountPercentage: 0,
    //       itemCount: 0,
    //       itemAvailable: true,
    //       itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
    //     }
    //   ]
    // }
  ]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get getAllShopList() {
    return this._shopList.asObservable();
  }

  getShopOfferedItems(shopId: string) {
    return this.getAllShopList.pipe(take(1), map(shop => {
      return {...shop.find(element => element.shopId === shopId)};
    }));
  }

  addNewItem(shopOfferedItem: IShopOfferedItems) {
    // this.http.post('https://orderitservices.firebaseio.com/shop-list.json', {})
    return this.getAllShopList.pipe(take(1), delay(1500), tap(shops => {
        const shopDetails = shops.find(element => {
          let userId = '';
          this.authService.userId.pipe(take(1)).subscribe(userIdValue => {
            if (!userIdValue) {
              // return;
              throw new Error('User Not Found');
            }
            userId = userIdValue;
          });
          return (element.userId === userId);
        });
        shopDetails.shopOfferedItemsList.push(shopOfferedItem);
        this._shopList.next(shops);
    }));
  }

  updateItemDetails(shopOfferedItem: IShopOfferedItems) {
    return this.getAllShopList.pipe(take(1), delay(1500), tap(shops => {

      // const shopDetails = shops.find(element => element.userId === this.authService.userId);
      const shopDetails = shops.find(element => {
        let userId = '';
        this.authService.userId.pipe(take(1)).subscribe(userIdValue => {
          if (!userIdValue) {
            throw new Error('User Not Found');
          }
          userId = userIdValue;
        });
        return (element.userId === userId);
      });
      const existingItem = shopDetails.shopOfferedItemsList.find(element => element.itemId === shopOfferedItem.itemId);
      existingItem.itemName = shopOfferedItem.itemName;
      existingItem.itemBrand = shopOfferedItem.itemBrand;
      existingItem.itemDescription =  shopOfferedItem.itemDescription;
      existingItem.itemCategory = shopOfferedItem.itemCategory;
      existingItem.itemUndiscountedRate = shopOfferedItem.itemUndiscountedRate;
      existingItem.itemWeight =  shopOfferedItem.itemWeight;
      existingItem.itemUnit = shopOfferedItem.itemUnit;
      existingItem.isDiscountedAvailable =  shopOfferedItem.isDiscountedAvailable;
      existingItem.itemDiscountedRate = shopOfferedItem.itemDiscountedRate;
      existingItem.discountAmount = shopOfferedItem.discountAmount;
      existingItem.discountPercentage = shopOfferedItem.discountPercentage;
      existingItem.itemCount = shopOfferedItem.itemCount;
      existingItem.itemAvailable = shopOfferedItem.itemAvailable;
      existingItem.itemImageUrl = shopOfferedItem.itemImageUrl;
      this._shopList.next(shops);
    }));
  }

  removeItem(itemId) {
    return this.getAllShopList.pipe(take(1), delay(1000), tap(shops => {
      // const shopDetails = shops.find(element => element.userId === this.authService.userId);
      const shopDetails = shops.find(element => {
        let userId = '';
        this.authService.userId.pipe(take(1)).subscribe(userIdValue => {
          if (!userIdValue) {
            // return;
            throw new Error('User Not Found');
          }
          userId = userIdValue;
          // return element.userId === userId;
        });
        return (element.userId === userId);
      });
      const newShopItemsList = shopDetails.shopOfferedItemsList.filter(element => element.itemId !== itemId);
      shopDetails.shopOfferedItemsList = newShopItemsList;
      this._shopList.next(shops);
    }));
  }
}
