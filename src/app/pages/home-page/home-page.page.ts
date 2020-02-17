import { Component, OnInit, OnDestroy } from "@angular/core";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { Subscription } from "rxjs";
import { MessageService } from "./../../shared/services/message.service";
import { CustomOrderService } from "src/app/services/custom-order.service";
import { IShopData } from 'src/app/models/shop-data.model';
import { CurrentShopProfileService } from 'src/app/shared/internal-services/current-shop-profile.service';

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.page.html",
  styleUrls: ["./home-page.page.scss"]
})
export class HomePagePage implements OnInit, OnDestroy {
  // Important command for live reloading on android device
  // ionic capacitor run android -l
  public allShopListSubs: Subscription;
  public message: any;
  public isItemSelected: boolean = false;
  public shopIdFromSavedCartItems: string;

  constructor(
    private shopItemSelectionService: ShopItemSelectionService,
    private messageService: MessageService,
    private customOrderService: CustomOrderService,
    private currentShopProfileService: CurrentShopProfileService
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
        if (this.customOrderService.selectableItemsOrders.length > 0 ) {
          this.isItemSelected = true;
        } else {
          this.isItemSelected = false;
        }
      });
  }

  ngOnInit() {
    this.shopItemSelectionService.getOrderedItemsFromLocalStorage().subscribe(localStorageItemsSaved => {
        const localStorageCartDataParsed = JSON.parse(localStorageItemsSaved.value);
        if (localStorageCartDataParsed.selectableItems.length > 0) {
          this.shopIdFromSavedCartItems = localStorageCartDataParsed.selectableItems[0].shopId;
          this.shopItemSelectionService.getShopProfileForCustomers(this.shopIdFromSavedCartItems)
          .then(shopProfile => {
            this.currentShopProfileService.currentShopProfile = shopProfile;
          });
        } else if (localStorageCartDataParsed.customItemsKG.length) {
          this.shopIdFromSavedCartItems = localStorageCartDataParsed.customItemsKG[0].shopId;
          this.shopItemSelectionService.getShopProfileForCustomers(this.shopIdFromSavedCartItems)
          .then(shopProfile => {
            this.currentShopProfileService.currentShopProfile = shopProfile;
          });
        } else if (localStorageCartDataParsed.customItemsPacks.length) {
          this.shopIdFromSavedCartItems = localStorageCartDataParsed.customItemsPacks[0].shopId;
          this.shopItemSelectionService.getShopProfileForCustomers(this.shopIdFromSavedCartItems)
          .then(shopProfile => {
            this.currentShopProfileService.currentShopProfile = shopProfile;
          });
        } else {
          this.shopIdFromSavedCartItems = '';
          this.currentShopProfileService.currentShopProfile = null;
        }
    });
  }

  clearMessage(): void {
    this.messageService.clearMessage();
  }

  ngOnDestroy() {
    if (this.allShopListSubs) {
      this.allShopListSubs.unsubscribe();
    }
  }
}
