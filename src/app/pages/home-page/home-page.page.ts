import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShopItemSelectionService } from 'src/app/services/shop-item-selection.service';
import { IShopList } from 'src/app/models/shop-list.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit, OnDestroy {
// Important command for live reloading on android device 
// ionic capacitor run android -l
  public shopList: IShopList[];
  public allShopListSubs: Subscription;

  constructor(private shopItemSelectionService: ShopItemSelectionService) { }

  ngOnInit() {
    this.allShopListSubs = this.shopItemSelectionService.getAllShopList.subscribe(shops => {
      this.shopList = shops;
    });
  }

  ngOnDestroy() {
    if (this.allShopListSubs) {
    this.allShopListSubs.unsubscribe();
    }
  }

}
