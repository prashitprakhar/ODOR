import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IShopList } from "./../models/shop-list.model";
import { IShopOfferedItems } from "../models/shop-offered-items.model";
import { IShopOfferedItemsData } from './../models/shop-offered-items-data.model';
import { IShopProfile } from './../models/shop-profile.model';
import { AuthService } from "./auth.service";
import { BehaviorSubject, from } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
// import { from } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Plugins } from "@capacitor/core";
import { IShopData } from '../models/shop-data.model';
import { ISelectableItemsOrder } from '../models/selectable-items-orders.model';
import { ICustomOrderItem } from '../models/custom-order-items.model';
import { environment } from './../../environments/environment';
import { HttpApiService } from '../shared/services/http-api.service';

@Injectable({
  providedIn: "root"
})
export class ShopItemSelectionService {
  private shopAPI: string = environment.internalAPI.shopFunctions;
  // private _shopList = new BehaviorSubject<IShopList[]>([
  //   {
  //     shopId: "SUDARSHANNAGARSHOP1",
  //     shopName: "Maha Lakshmi Kirana & General Store",
  //     shopType: "GROCERY",
  //     shopLocation: "SUDARSHAN NAGAR COLONY",
  //     shopAddress: "SUDARSHAN NAGAR COLONY",
  //     shopPostalCode: 500032,
  //     shopImageUrl:
  //       "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y",
  //     shopRating: 4.5,
  //     userId: "0YFzC3NLQwafa78cKc92dU6X9i52",
  //     firstOrderTime: "7 AM",
  //     lastOrderTime: "10 PM",
  //     isShopOpen: true,
  //     shopOfferedItemsList: [
  //       {
  //         itemId: "MILK1",
  //         itemName: "Jersey Milk",
  //         itemBrand: "Jersey",
  //         itemDescription: "Packaged Milk Tetra Pack",
  //         itemCategory: "Packaged",
  //         itemUndiscountedRate: 10,
  //         isDiscountedAvailable: false,
  //         itemDiscountedRate: 10,
  //         discountAmount: 0,
  //         discountPercentage: 0,
  //         itemWeight: 100,
  //         itemUnit: "g",
  //         itemCount: 0,
  //         itemAvailable: false,
  //         itemImageUrl:
  //           "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
  //       },
  //       {
  //         itemId: "MILK2",
  //         itemName: "Jersey Milk",
  //         itemBrand: "Jersey",
  //         itemDescription: "Packaged Milk Tetra Pack",
  //         itemCategory: "Packaged",
  //         itemUndiscountedRate: 10,
  //         isDiscountedAvailable: false,
  //         itemDiscountedRate: 10,
  //         discountAmount: 0,
  //         discountPercentage: 0,
  //         itemCount: 0,
  //         itemWeight: 100,
  //         itemUnit: "g",
  //         itemAvailable: true,
  //         itemImageUrl:
  //           "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
  //       },
  //       {
  //         itemId: "MILK3",
  //         itemName: "Jersey Milk",
  //         itemBrand: "Jersey",
  //         itemDescription: "Packaged Milk Tetra Pack",
  //         itemCategory: "Packaged",
  //         itemUndiscountedRate: 10,
  //         isDiscountedAvailable: false,
  //         itemDiscountedRate: 10,
  //         discountAmount: 0,
  //         discountPercentage: 0,
  //         itemCount: 0,
  //         itemWeight: 100,
  //         itemUnit: "g",
  //         itemAvailable: true,
  //         itemImageUrl:
  //           "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
  //       },
  //       {
  //         itemId: "MILK4",
  //         itemName: "Jersey Milk",
  //         itemBrand: "Jersey",
  //         itemDescription: "Packaged Milk Tetra Pack",
  //         itemCategory: "Packaged",
  //         itemUndiscountedRate: 10,
  //         isDiscountedAvailable: false,
  //         itemDiscountedRate: 10,
  //         discountAmount: 0,
  //         discountPercentage: 0,
  //         itemCount: 0,
  //         itemWeight: 100,
  //         itemUnit: "g",
  //         itemAvailable: true,
  //         itemImageUrl:
  //           "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
  //       }
  //     ]
  //   }
  // ]);
  private _shopList = new BehaviorSubject<IShopData[]>(null);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private db: AngularFirestore,
    private httpAPIService: HttpApiService
  ) {}

  // get getAllShopList() {
  //   return this._shopList.asObservable();
  // }

  get getAllShopList() {
    return from(this.db.collection('ENTERPRISE_PARTNER_PRODUCTS').valueChanges()).pipe(
      take(1),
      map(data => {
        this._shopList.next(data as IShopData[]);
        return data as IShopData[];
      })
    );
  }

  get getShopListForCustomer() {
    this._shopList.subscribe(data => {
    });
    return this._shopList.asObservable();
  }

  getShopData(collectionId: string, shopId: string) {
    return this.db.collection(collectionId, ref => ref.where("shopId", "==", shopId))
            .snapshotChanges()
            .pipe(take(1));
  }

  async getShopOfferedItemsList(shopId: string): Promise<IShopOfferedItemsData> {
    const url = `${this.shopAPI}getShopOfferedItems`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    // console.log("userDataFetched userDataFetched --- In Logout", userDate);
    const userToken = userDataFetched.token;
    const payload = {
      shopId
    };

    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);

  }

  async getShopProfile(shopId: string): Promise<IShopProfile> {
    const url = `${this.shopAPI}getShopProfile`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    // console.log("userDataFetched userDataFetched --- In Logout", userDate);
    const userToken = userDataFetched.token;
    const payload = {
      shopId
    };

    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  getShopOfferedItems(collectionId: string, shopId: string) {
    return from(this.db.collection(collectionId, ref => ref.where("shopId", "==", shopId))
    .valueChanges()).pipe(
      take(1),
      map(data => {
        console.log("Data **********************", data);
        // this._shopList.next(data as IShopData[]);
        return data as IShopData[];
      })
    );
    // .pipe(
    //   take(1),
    //   map(shop => {
    //     return shop.map(element => {
    //       console.log("Shop data Fetched Service ******", element.payload)
    //       return element.payload.doc.data() as IShopList
    //     })
    //   })
    // );
    // this.getAllShopList.pipe(
    //   take(1),
    //   map(shop => {
    //     return { ...shop.find(element => element.shopId === shopId) };
    //   })
    // );
  }

  async setItemAvailability(shopId: string, itemId: string): Promise<IShopOfferedItemsData> {
    const payload = {
      shopId,
      itemId
    };
    const url = `${this.shopAPI}changeItemAvailability`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    // console.log("userDataFetched userDataFetched --- In Logout", userDate);
    const userToken = userDataFetched.token;
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async setShopOpeStatus(shopId: string): Promise<IShopOfferedItemsData> {
    const payload = {
      shopId
    };
    const url = `${this.shopAPI}changeShopOpenStatus`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    // console.log("userDataFetched userDataFetched --- In Logout", userDate);
    const userToken = userDataFetched.token;
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async updateItemDetails(shopId: string, updatedItemdetails: IShopOfferedItems): Promise<IShopOfferedItemsData> {
    const payload = {
      shopId,
      itemId: updatedItemdetails.itemId,
      itemName: updatedItemdetails.itemName,
      itemBrand: updatedItemdetails.itemBrand,
      itemDescription: updatedItemdetails.itemDescription,
      itemCategory: updatedItemdetails.itemCategory,
      itemUndiscountedRate: updatedItemdetails.itemUndiscountedRate,
      itemWeight: updatedItemdetails.itemWeight,
      itemUnit: updatedItemdetails.itemUnit,
      isDiscountedAvailable: updatedItemdetails.isDiscountedAvailable,
      itemDiscountedRate: updatedItemdetails.itemDiscountedRate,
      discountAmount: updatedItemdetails.discountAmount,
      discountPercentage: updatedItemdetails.discountPercentage,
      itemCount: updatedItemdetails.itemCount,
      itemAvailable: updatedItemdetails.itemAvailable,
      itemImageUrl: updatedItemdetails.itemImageUrl
    };
    const url = `${this.shopAPI}updateItemDetails`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    // console.log("userDataFetched userDataFetched --- In Logout", userDate);
    const userToken = userDataFetched.token;
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async deteteShopItem(shopId: string, itemId: string): Promise<any> {
    const payload = {
      shopId,
      itemId
    };
    const url = `${this.shopAPI}deleteItem`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }
  // getShopOfferedItems(shopId: string) {
  //   return this.getAllShopList.pipe(
  //     take(1),
  //     map(shop => {
  //       return { ...shop.find(element => element.shopId === shopId) };
  //     })
  //   );
  // }

  getShopOfferedItemsForCustomer(shopId) {
    return this.getShopListForCustomer.pipe(
      take(1),
      map(shop => {
        if (shop) {
          return { ...shop.find(element => element.shopId === shopId) };
        } else {
          return null;
        }
      })
    );
  }

  // getShopProfile(collectionId, )

  getProductDoc(collectionId, userId: string) {
    return this.db
      .collection(collectionId, ref => ref.where("shopId", "==", userId))
      .snapshotChanges()
      .pipe(take(1));
  }

  updateDocument(collectionId, updatedData, docId: string) {
    return from(
      this.db.doc(`${collectionId}/${docId}`).update(updatedData)
    ).pipe(take(1));
  }

  // addNewItem(shopOfferedItem: IShopOfferedItems) {
  //   let shopDetailsList: IShopList[];
  //   return this.getAllShopList.pipe(
  //     take(1),
  //     delay(1500),
  //     tap(shops => {
  //       shopDetailsList = shops;
  //       const shopDetails = shops.find(element => {
  //         let userId = "";
  //         this.authService.userId.pipe(take(1)).subscribe(userIdValue => {
  //           if (!userIdValue) {
  //             throw new Error("User Not Found");
  //           }
  //           userId = userIdValue;
  //         });
  //         return element.userId === userId;
  //       });
  //       shopDetails.shopOfferedItemsList.push(shopOfferedItem);
  //       this._shopList.next(shops);
  //     })
  //   );
  // }

  // updateItemDetails(shopOfferedItem: IShopOfferedItems) {
  //   return this.getAllShopList.pipe(
  //     take(1),
  //     delay(1500),
  //     tap(shops => {
  //       const shopDetails = shops.find(element => {
  //         let userId = "";
  //         this.authService.userId.pipe(take(1)).subscribe(userIdValue => {
  //           if (!userIdValue) {
  //             throw new Error("User Not Found");
  //           }
  //           userId = userIdValue;
  //         });
  //         return element.userId === userId;
  //       });
  //       const existingItem = shopDetails.shopOfferedItemsList.find(
  //         element => element.itemId === shopOfferedItem.itemId
  //       );
  //       existingItem.itemName = shopOfferedItem.itemName;
  //       existingItem.itemBrand = shopOfferedItem.itemBrand;
  //       existingItem.itemDescription = shopOfferedItem.itemDescription;
  //       existingItem.itemCategory = shopOfferedItem.itemCategory;
  //       existingItem.itemUndiscountedRate =
  //         shopOfferedItem.itemUndiscountedRate;
  //       existingItem.itemWeight = shopOfferedItem.itemWeight;
  //       existingItem.itemUnit = shopOfferedItem.itemUnit;
  //       existingItem.isDiscountedAvailable =
  //         shopOfferedItem.isDiscountedAvailable;
  //       existingItem.itemDiscountedRate = shopOfferedItem.itemDiscountedRate;
  //       existingItem.discountAmount = shopOfferedItem.discountAmount;
  //       existingItem.discountPercentage = shopOfferedItem.discountPercentage;
  //       existingItem.itemCount = shopOfferedItem.itemCount;
  //       existingItem.itemAvailable = shopOfferedItem.itemAvailable;
  //       existingItem.itemImageUrl = shopOfferedItem.itemImageUrl;
  //       this._shopList.next(shops);
  //     })
  //   );
  // }

  // removeItem(itemId) {
  //   return this.getAllShopList.pipe(
  //     take(1),
  //     delay(1000),
  //     tap(shops => {
  //       const shopDetails = shops.find(element => {
  //         let userId = "";
  //         this.authService.userId.pipe(take(1)).subscribe(userIdValue => {
  //           if (!userIdValue) {
  //             throw new Error("User Not Found");
  //           }
  //           userId = userIdValue;
  //         });
  //         return element.userId === userId;
  //       });
  //       const newShopItemsList = shopDetails.shopOfferedItemsList.filter(
  //         element => element.itemId !== itemId
  //       );
  //       shopDetails.shopOfferedItemsList = newShopItemsList;
  //       this._shopList.next(shops);
  //     })
  //   );
  // }

  addOrderedItemsToLocalStorage(selectableItems: ISelectableItemsOrder[],
                                customItemsKG: ICustomOrderItem[], customItemsPacks: ICustomOrderItem[]) {
    // Plugins.Storage.set({ key: "authData", value: orderedItem });
    console.log("selectable Items List", selectableItems);
    console.log("cutom Items List", customItemsKG);
    console.log("customItemsPacks List", customItemsPacks);
    const userSelectionCustomItems = {
      // tslint:disable-next-line: object-literal-shorthand
      selectableItems : selectableItems,
      // tslint:disable-next-line: object-literal-shorthand
      customItemsKG : customItemsKG ? customItemsKG : [],
      // tslint:disable-next-line: object-literal-shorthand
      customItemsPacks : customItemsPacks ? customItemsPacks : []
    };
    Plugins.Storage.set({ key: 'userSelectionCustomItems', value: JSON.stringify(userSelectionCustomItems) });
  }

  getOrderedItemsFromLocalStorage() {
    return from(Plugins.Storage.get({ key: "userSelectionCustomItems" })).pipe(
      map(data => {
        console.log(":Data fetched from local storage ******", data);
        return data;
      })
    );
    // return [];
  }

  removeUserSelectionFromLocalStorage() {
    Plugins.Storage.remove({ key: "userSelectionCustomItems" }).then(removalSuccess => {})
    .catch(err => {
      console.log("removeUserSelectionFromLocalStorage failure", err);
    });
  }

  async addShopOfferedNewItem(itemDetails): Promise<any> {
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const payload = {
      shopId: userDataFetched.userId,
      itemName: itemDetails.itemName,
      itemBrand: itemDetails.itemBrand,
      itemDescription: itemDetails.itemDescription,
      itemCategory: itemDetails.itemCategory,
      itemUndiscountedRate: itemDetails.itemUndiscountedRate,
      itemWeight: itemDetails.itemWeight,
      itemUnit: itemDetails.itemUnit,
      isDiscountedAvailable: itemDetails.isDiscountedAvailable,
      itemDiscountedRate: itemDetails.itemDiscountedRate,
      discountAmount: itemDetails.discountAmount,
      discountPercentage: itemDetails.discountPercentage,
      itemCount: itemDetails.itemCount,
      itemAvailable: itemDetails.itemAvailable,
      itemImageUrl: itemDetails.itemImageUrl
    };

    const url = `${this.shopAPI}addShopItems`;
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }
}
