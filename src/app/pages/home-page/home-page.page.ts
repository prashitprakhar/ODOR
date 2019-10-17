import { Component, OnInit } from '@angular/core';
import { ShopItemSelectionService } from 'src/app/services/shop-item-selection.service';
import { IShopList } from 'src/app/models/shop-list.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit {
// Important command for live reloading on android device 
// ionic capacitor run android -l
  public shopList: IShopList[];

  constructor(private shopItemSelectionService: ShopItemSelectionService) { }

  ngOnInit() {
    this.shopList = this.shopItemSelectionService.getAllShopList();
  }

}
