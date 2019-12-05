import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShopItemSelectionService } from 'src/app/services/shop-item-selection.service';
import { IShopOfferedItems } from 'src/app/models/shop-offered-items.model';
import { IShopList } from 'src/app/models/shop-list.model';
import { Plugins } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { ModalController, IonItemSliding } from '@ionic/angular';
import { EditItemDetailsModalComponent } from 'src/app/enterprise-partner-modals/edit-item-details-modal/edit-item-details-modal.component';


@Component({
  selector: 'app-partner-my-shop',
  templateUrl: './partner-my-shop.page.html',
  styleUrls: ['./partner-my-shop.page.scss'],
})
export class PartnerMyShopPage implements OnInit, OnDestroy {

  public shopId: any;
  public shopDetails: IShopList;
  public shopOfferedItemsList: IShopOfferedItems[] = [];
  public allShopListSubs: Subscription;
  public shopOfferedItemsSubs: Subscription;

  constructor(private shopItemSelectionService: ShopItemSelectionService,
              private editItemDetailsModalCtrl: ModalController) {}

  ngOnInit() {
    const shopId = this.getStorageData();
    shopId.then(data => {
      this.shopId = JSON.parse(data.value);
      this.allShopListSubs = this.shopItemSelectionService.getShopOfferedItems(this.shopId.toString()).subscribe(shop => {
        this.shopDetails = shop;
        this.shopOfferedItemsList = this.shopDetails.shopOfferedItemsList;
      });
    });
  }

  ionViewDidEnter() {
      this.allShopListSubs = this.shopItemSelectionService.getShopOfferedItems(this.shopId.toString()).subscribe(shop => {
        this.shopDetails = shop;
        this.shopOfferedItemsList = this.shopDetails.shopOfferedItemsList;
      });
  }

  deleteItem(itemId) {
    this.shopItemSelectionService.removeItem(itemId).subscribe(data => {
      const currentShop = data.find(element => element.shopId === this.shopId.toString());
      this.shopOfferedItemsList = currentShop.shopOfferedItemsList;
    });
  }

  editItemDetails(item, editEl: IonItemSliding) {
    console.log("Item ID ***", item);
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
    const itemSelected = this.shopOfferedItemsList.find(element => element.itemId === item.itemId);
    itemSelected.itemAvailable = !itemSelected.itemAvailable;
  }

  async getStorageData(): Promise<any> {
    const shopId = await Plugins.Storage.get({key: 'shopId'});
    return shopId;
  }

  setShopOpenCloseStatus(shopDetails) {
    this.shopDetails.isShopOpen = !this.shopDetails.isShopOpen;
  }

}
