import { Component, OnInit, OnDestroy } from "@angular/core";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopList } from "src/app/models/shop-list.model";
import { DeliveryTimeService } from "src/app/services/delivery-time.service";
import { IStandardDeliveryTime } from 'src/app/models/standard-delivery-time.model';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-all-shops",
  templateUrl: "./all-shops.page.html",
  styleUrls: ["./all-shops.page.scss"]
})
export class AllShopsPage implements OnInit, OnDestroy {

  public shopList: IShopList[];
  public currentDeliveryTimeSchedule: IStandardDeliveryTime;
  public allShopListSubs: Subscription;

  constructor(
    private shopItemSelectionService: ShopItemSelectionService,
    private deliveryTimeService: DeliveryTimeService,
    private router: Router,
    private shopClosedAlertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.allShopListSubs = this.shopItemSelectionService.getAllShopList.subscribe(shops => {
      this.shopList = shops;
    })
    this.currentDeliveryTimeSchedule = this.deliveryTimeService.getManipulatedDeliveryTime();
  }
  // [routerLink]="['/', 'homepage', 'tabs', 'selectShop', shop.shopId]"

  ngOnDestroy() {
    if (this.allShopListSubs) {
    this.allShopListSubs.unsubscribe();
    }
  }

  navigateToShopOfferedItemsPage(shop) {
    if (shop.isShopOpen) {
      this.router.navigate(['/homepage/tabs/selectShop', shop.shopId]) ;
    } else {
      const alert = this.shopClosedAlertCtrl
          .create({
            header: "Shop is currently closed.",
            // message:
            //   "Please ",
            buttons: [
              {
                text: "OK",
                role: "cancel",
                cssClass: "secondary",
                handler: cancel => {
                  console.log("Shop is closed");
                }
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
    }
  }
}
