import { Component, OnInit } from "@angular/core";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopList } from "src/app/models/shop-list.model";
import { DeliveryTimeService } from "src/app/services/delivery-time.service";
import { IStandardDeliveryTime } from 'src/app/models/standard-delivery-time.model';

@Component({
  selector: "app-all-shops",
  templateUrl: "./all-shops.page.html",
  styleUrls: ["./all-shops.page.scss"]
})
export class AllShopsPage implements OnInit {

  public shopList: IShopList[];
  public currentDeliveryTimeSchedule: IStandardDeliveryTime;

  constructor(
    private shopItemSelectionService: ShopItemSelectionService,
    private deliveryTimeService: DeliveryTimeService
  ) {}

  ngOnInit() {
    this.shopList = this.shopItemSelectionService.getAllShopList();
    this.currentDeliveryTimeSchedule = this.deliveryTimeService.getManipulatedDeliveryTime()
  }
}
