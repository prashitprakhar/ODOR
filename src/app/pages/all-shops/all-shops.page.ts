import { Component, OnInit, OnDestroy } from "@angular/core";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopList } from "src/app/models/shop-list.model";
import { DeliveryTimeService } from "src/app/services/delivery-time.service";
import { IStandardDeliveryTime } from 'src/app/models/standard-delivery-time.model';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IShopData } from 'src/app/models/shop-data.model';
import { NetworkService } from 'src/app/shared/services/network.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { NoInternetConnectivityModalComponent } from 'src/app/shared/modals/no-internet-connectivity-modal/no-internet-connectivity-modal.component';

@Component({
  selector: "app-all-shops",
  templateUrl: "./all-shops.page.html",
  styleUrls: ["./all-shops.page.scss"]
})
export class AllShopsPage implements OnInit, OnDestroy {

  // public shopList: IShopList[];
  public shopList: IShopData[];
  public currentDeliveryTimeSchedule: IStandardDeliveryTime;
  public allShopListSubs: Subscription;
  public networkStatusSubs: Subscription;
  public networkStatus: boolean = true;

  constructor(
    private shopItemSelectionService: ShopItemSelectionService,
    private deliveryTimeService: DeliveryTimeService,
    private router: Router,
    private shopClosedAlertCtrl: AlertController,
    private networkService: NetworkService,
    private messageService: MessageService,
    private noInternetConnModal: ModalController
  ) {}

  ngOnInit() {
    // this.allShopListSubs = this.shopItemSelectionService.getAllShopList.subscribe(shops => {
    //   console.log(" SHOPS FETCHED ********", shops);
    //   this.shopList = shops;
    //   this.handleRefresher(event);
    // });
    this.currentDeliveryTimeSchedule = this.deliveryTimeService.getManipulatedDeliveryTime();
    this.checkNetworkStatus();
              // this.networkStatusSubs = this.networkService.checkNetworkStatus().subscribe(networkData => {
              //   console.log("Came inside Subscribe *********");
              //   if (!networkData.connected) {
              //     this.networkStatus = false;
              //     this.messageService.sendNetworkStatusMessage({NETWORK_CONNECTION : false});
              //   } else {
              //     this.networkStatus = true;
              //     this.messageService.sendNetworkStatusMessage({NETWORK_CONNECTION : true});
              //     // this.getInitialData();
              //     this.fetchShopsList();
              //   }
              // });
  }

  showNoInternetConnectionModal() {
    // showLoginSignupScreen() {
      this.noInternetConnModal
        .create({
          component: NoInternetConnectivityModalComponent,
          id: "noInternetConnModal"
        })
        .then(loginModalEl => {
          loginModalEl.present();
          return loginModalEl.onDidDismiss();
        })
        .then(data => {
          console.log("No Network Conn modal closed")
          // if (data.role === "LOGIN_SUCCESS") {
          //   if (data.data === "ENTERPRISE_PARTNER") {
          //     this.router.navigateByUrl("/partnerHomePage/partnerTabs");
          //   } else if (data.data === "GENERAL_ADMIN") {
          //     this.router.navigateByUrl("/adminHomePage/adminTab");
          //   } else if (data.data === "CUSTOMER") {
          //     // this.router.navigateByUrl("/homepage/tabs/account");
          //     this.router.navigateByUrl("/homepage/tabs");
          //   }
          // } else {
          //   this.router.navigateByUrl("/homepage/tabs");
          // }
        });
    // }
  }

  checkNetworkStatus(event = null) {
    this.networkStatusSubs = this.networkService.checkNetworkStatus().subscribe(networkData => {
      // console.log("Came inside Subscribe *********");
      if (!networkData.connected) {
        this.networkStatus = false;
        this.messageService.sendNetworkStatusMessage({NETWORK_CONNECTION : false});
        this.showNoInternetConnectionModal();
        // this.handleRefresher(event);
      } else {
        this.networkStatus = true;
        this.messageService.sendNetworkStatusMessage({NETWORK_CONNECTION : true});
        // this.getInitialData();
        this.fetchShopsList();
      }
    });
  }

  // [routerLink]="['/', 'homepage', 'tabs', 'selectShop', shop.shopId]"
  ionViewWillEnter() {
    // console.log("Came here in ion View Will Enter");
            // this.networkStatusSubs = this.networkService.checkNetworkStatus().subscribe(networkData => {
            //   // console.log("Came inside Subscribe *********")
            //   if (!networkData.connected) {
            //     this.networkStatus = false;
            //     this.messageService.sendNetworkStatusMessage({NETWORK_CONNECTION : false});
            //     // this.handleRefresher(event);
            //   } else {
            //     this.networkStatus = true;
            //     this.messageService.sendNetworkStatusMessage({NETWORK_CONNECTION : true});
            //     // this.getInitialData();
            //     // this.fetchShopsList();
            //   }
            // });
            this.checkNetworkStatus();
  }

  fetchShopsList(event = null) {
    this.allShopListSubs = this.shopItemSelectionService.getAllShopList.subscribe(shops => {
      // console.log(" SHOPS FETCHED ********", shops);
      this.shopList = shops;
      this.handleRefresher(event);
    });
    this.currentDeliveryTimeSchedule = this.deliveryTimeService.getManipulatedDeliveryTime();
  }

  doRefresh(event) {
    // console.log('Begin async operation');

    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   event.target.complete();
    // }, 2000);
    // this.fetchShopsList(event);
    this.checkNetworkStatus(event);
  }

  handleRefresher(event) {
    if (event) {
      setTimeout(() => {
        event.target.complete();
      }, 2000);
    }
  }

  ngOnDestroy() {
    if (this.allShopListSubs) {
    this.allShopListSubs.unsubscribe();
    }
    if(this.networkStatusSubs) {
      this.networkStatusSubs.unsubscribe();
    }
  }

  navigateToShopOfferedItemsPage(shop) {
    // console.log("SHOP ON CLICK",shop)
    if (shop.isShopOpen) {
      // console.log("shop.shopId", shop.shopId)
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
                  // console.log("Shop is closed");
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
