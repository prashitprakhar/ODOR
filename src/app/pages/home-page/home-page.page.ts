import { Component, OnInit, OnDestroy } from "@angular/core";
import { Events } from "@ionic/angular";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopList } from "src/app/models/shop-list.model";
import { Subscription } from "rxjs";
// import { CustomOrderService } from 'src/app/services/custom-order.service';
import { MessageService } from "./../../shared/services/message.service";
import { CustomOrderService } from "src/app/services/custom-order.service";
import { IShopData } from 'src/app/models/shop-data.model';

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.page.html",
  styleUrls: ["./home-page.page.scss"]
})
export class HomePagePage implements OnInit, OnDestroy {
  // Important command for live reloading on android device
  // ionic capacitor run android -l
  // public shopList: IShopList[];
  public shopList: IShopData[];
  public allShopListSubs: Subscription;
  public message: any;
  public isItemSelected: boolean = false;

  constructor(
    private shopItemSelectionService: ShopItemSelectionService,
    private messageService: MessageService,
    private customOrderService: CustomOrderService
  ) {
    if (this.customOrderService.selectableItemsOrders) {
      if (this.customOrderService.selectableItemsOrders.length > 0 ) {
        this.isItemSelected = true;
      } else {
        this.isItemSelected = false;
      }
    }

    this.allShopListSubs = this.messageService
      .getMessage()
      .subscribe(message => {
        this.message = message;
        console.log("this.customOrderService.selectableItemsOrders", this.customOrderService.selectableItemsOrders);
        if (this.customOrderService.selectableItemsOrders.length > 0 ) {
          this.isItemSelected = true;
        } else {
          this.isItemSelected = false;
        }
      });
  }

  ngOnInit() {
    this.allShopListSubs = this.shopItemSelectionService.getAllShopList.subscribe(
      shops => {
        this.shopList = shops;
      }
    );
  }

  clearMessage(): void {
    // clear message
    this.messageService.clearMessage();
  }

  ngOnDestroy() {
    if (this.allShopListSubs) {
      this.allShopListSubs.unsubscribe();
    }
  }
}
