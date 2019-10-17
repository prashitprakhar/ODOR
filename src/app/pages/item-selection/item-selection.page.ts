import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopList } from "src/app/models/shop-list.model";
import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
import { SegmentChangeEventDetail } from "@ionic/core";

@Component({
  selector: "app-item-selection",
  templateUrl: "./item-selection.page.html",
  styleUrls: ["./item-selection.page.scss"]
})
export class ItemSelectionPage implements OnInit {
  selectedShopDetails: IShopList;
  // shopOfferedItems: IShopOfferedItems[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private shopItemSelectionService: ShopItemSelectionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("shopId")) {
        return;
      }
      const shopId = paramMap.get("shopId");
      this.selectedShopDetails = this.shopItemSelectionService.getShopOfferedItems(
        shopId
      );
      // this.shopOfferedItems = this.selectedShopDetails.shopOfferedItemsList;
    });
  }

  // onToggleItemSearchTypeButton(event: CustomEvent<SegmentChangeEventDetail>) {
  //   console.log(
  //     "Event Details on Toggle Item Search Type Button",
  //     event.detail
  //   );
  //   // if(event.detail === 'ITEM_SELECTION') {
  //   //   this.router.navigateByUrl([''])
  //   // }
  // }

  addCustomOrders() {
    console.log("addCustomOrders")
  }

  showOrderDetails() {
    console.log("showOrderDetails")
  }

  increment(){

  }

  decrement(){
    
  }
}
