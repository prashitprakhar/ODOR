import { Component, OnInit } from '@angular/core';
import { ShopItemSelectionService } from 'src/app/services/shop-item-selection.service';
import { IShopOfferedItems } from 'src/app/models/shop-offered-items.model';
import { IShopList } from 'src/app/models/shop-list.model';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-partner-my-shop',
  templateUrl: './partner-my-shop.page.html',
  styleUrls: ['./partner-my-shop.page.scss'],
})
export class PartnerMyShopPage implements OnInit {

  public shopId: string;
  public shopDetails: IShopList;
  public shopOfferedItemsList: IShopOfferedItems[] = [];

  constructor(private shopItemSelectionService: ShopItemSelectionService) { }

  ngOnInit() {
    const shopId = this.getStorageData();
    shopId.then(data => {
     // console.log("data ",data)
      this.shopId = JSON.parse(data.value);
      this.shopDetails = this.shopItemSelectionService.getAllShopList().find(element => element.shopId === this.shopId.toString());
      this.shopOfferedItemsList = this.shopDetails.shopOfferedItemsList;
    // console.log("this.shopDetails",this.shopDetails);
    // console.log("this.shopOfferedItems",this.shopOfferedItems);
    });
    // .then(data => {
    //   this.shopId = JSON.parse(data.value);
    //  console.log("fetching Data local storage ***",this.shopId)
    // });
  }

  setAvailability(item) {
    const itemSelected = this.shopOfferedItemsList.find(element => element.itemId === item.itemId);
    itemSelected.itemAvailable = !itemSelected.itemAvailable;
  }

  async getStorageData(): Promise<any> {
    const shopId = await Plugins.Storage.get({key: 'shopId'});
    return shopId;
  }

}
