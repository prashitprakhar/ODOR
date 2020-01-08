import { Component, OnInit, OnDestroy } from "@angular/core";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
import { IShopList } from "src/app/models/shop-list.model";
import { IShopData } from "src/app/models/shop-data.model";
import { Plugins } from "@capacitor/core";
import { Subscription } from "rxjs";
import { ModalController, IonItemSliding } from "@ionic/angular";
import { EditItemDetailsModalComponent } from "src/app/enterprise-partner-modals/edit-item-details-modal/edit-item-details-modal.component";

@Component({
  selector: "app-partner-my-shop",
  templateUrl: "./partner-my-shop.page.html",
  styleUrls: ["./partner-my-shop.page.scss"]
})
export class PartnerMyShopPage implements OnInit, OnDestroy {
  public shopId: any;
  // public shopDetails: IShopList[];
  public shopDetails: IShopData[];
  public shopOfferedItemsList: IShopOfferedItems[] = [];
  public allShopListSubs: Subscription;
  public shopOfferedItemsSubs: Subscription;

  constructor(
    private shopItemSelectionService: ShopItemSelectionService,
    private editItemDetailsModalCtrl: ModalController
  ) {}

  ngOnInit() {
    // const shopId = this.getStorageData();
    const userData = this.getStoredUserInfo();
    userData.then(data => {
      const userDataFetched = JSON.parse(data.value);
      this.shopId = userDataFetched.userId;
      // console.log("this.shopId this.shopId",this.shopId);
      // user ID : LFOvhdrs5ZW1XqX9CmY66B12IuI2
      // this.allShopListSubs = this.shopItemSelectionService
      //   .getShopOfferedItems('ENTERPRISE_PARTNER_PRODUCTS', this.shopId.toString())
      //   .subscribe(shop => {
      //     console.log("ON INIT Shop Fetched *********", shop);
      //     this.shopDetails = shop;
      //     this.shopOfferedItemsList = this.shopDetails[0].shopOfferedItems; //Commented Here
      //   });
    });
    // shopId.then(data => {
    //   this.shopId = JSON.parse(data.value);
    //   this.allShopListSubs = this.shopItemSelectionService
    //     .getShopOfferedItems('ENTERPRISE_PARTNER_PRODUCTS', this.shopId.toString())
    //     .subscribe(shop => {
    //       console.log("ON INIT Shop Fetched *********", shop);
    //       // this.shopDetails = shop;
    //       // this.shopOfferedItemsList = this.shopDetails.shopOfferedItemsList; //Commented Here
    //     });
    // });
  }

  ionViewDidEnter() {
    this.allShopListSubs = this.shopItemSelectionService
      .getShopOfferedItems('ENTERPRISE_PARTNER_PRODUCTS', this.shopId.toString())
      .subscribe(shop => {
        this.shopDetails = shop;
        this.shopOfferedItemsList = this.shopDetails[0].shopOfferedItems; // Commented Here
      });
  }

  ionViewDidLeave() {
    if (this.allShopListSubs) {
      this.allShopListSubs.unsubscribe();
    }
  }

  deleteItem(itemId) {
    this.shopItemSelectionService.getProductDoc('ENTERPRISE_PARTNER_PRODUCTS', this.shopId.toString())
    .subscribe(newItemAdd => {
      const docId = newItemAdd.map(data => data.payload.doc.id);
      const doc = newItemAdd.map(element => element.payload.doc.data());
      const shopOfferedItems = doc[0]["shopOfferedItems"].filter(element => element.itemId !== itemId);
      doc[0]["shopOfferedItems"] = shopOfferedItems;
      this.shopItemSelectionService.updateDocument('ENTERPRISE_PARTNER_PRODUCTS', doc[0], docId[0])
      .subscribe(updatedDoc => {
      }, error => {
        console.log("Error Occured While Deleting Item");
      });
  });
    // this.shopItemSelectionService.removeItem(itemId).subscribe(data => {
    //   const currentShop = data.find(
    //     element => element.shopId === this.shopId.toString()
    //   );
    //   this.shopOfferedItemsList = currentShop.shopOfferedItemsList;
    // });
  }

  editItemDetails(item, editEl: IonItemSliding) {
    editEl.close();
    this.editItemDetailsModalCtrl
      .create({
        component: EditItemDetailsModalComponent,
        componentProps: {
          name: "editItemDetailsModal",
          selectedShopId: this.shopId,
          product: item
        },
        id: "editItemDetailsModal"
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(data => {
        // console.log(
        //   "this.customOrderService.customItemOrdersDetails",
        //   this.customOrderService.customItemOrdersDetails
        // );
        // if(data.role === 'confirm'){
        //   console.log("Save users data")
        // }
        // else if(data.role === 'cancel'){
        //   console.log("Dont save users data")
        // }
      });
  }

  ngOnDestroy() {
    if (this.allShopListSubs) {
      this.allShopListSubs.unsubscribe();
    }
    if (this.shopOfferedItemsSubs) {
      this.shopOfferedItemsSubs.unsubscribe();
    }
  }

  setAvailability(item) {
    const itemId = item.itemId;
    this.shopItemSelectionService.getProductDoc('ENTERPRISE_PARTNER_PRODUCTS', this.shopId.toString())
    .subscribe(newItemAdd => {
      const docId = newItemAdd.map(data => data.payload.doc.id);
      const doc = newItemAdd.map(element => element.payload.doc.data());
      const selectedItem = doc[0]["shopOfferedItems"].find(element => element.itemId === itemId);
      const shopOfferedItems = doc[0]["shopOfferedItems"].filter(element => element.itemId !== itemId);
      selectedItem["itemAvailable"] = !selectedItem["itemAvailable"]
      shopOfferedItems.push(selectedItem)
      doc[0]["shopOfferedItems"] = shopOfferedItems;
      this.shopItemSelectionService.updateDocument('ENTERPRISE_PARTNER_PRODUCTS', doc[0], docId[0])
      .subscribe(updatedDoc => {
      }, error => {
        console.log("Error Occured While Deleting Item");
      });
  });
    // const itemSelected = this.shopOfferedItemsList.find(
    //   element => element.itemId === item.itemId
    // );
    // itemSelected.itemAvailable = !itemSelected.itemAvailable;
  }

  async getStorageData(): Promise<any> {
    const shopId = await Plugins.Storage.get({ key: "shopId" });
    return shopId;
  }

  async getStoredUserInfo(): Promise<any> {
    const userData = await Plugins.Storage.get({ key: 'authData'});
    return userData;
  }

  setShopOpenCloseStatus(shopDetails) {
    this.shopItemSelectionService.getProductDoc('ENTERPRISE_PARTNER_PRODUCTS', this.shopId.toString())
    .subscribe(newItemAdd => {
      const docId = newItemAdd.map(data => data.payload.doc.id);
      const doc = newItemAdd.map(element => element.payload.doc.data());
      doc[0]["isShopOpen"] = !doc[0]["isShopOpen"];
      this.shopItemSelectionService.updateDocument('ENTERPRISE_PARTNER_PRODUCTS', doc[0], docId[0])
      .subscribe(updatedDoc => {
      }, error => {
        console.log("Error Occured While Deleting Item");
      });
  });
  }
}
