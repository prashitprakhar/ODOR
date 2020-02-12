import { Component, OnInit, OnDestroy } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { NetworkService } from "./shared/services/network.service";
import { MessageService } from "./shared/services/message.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { CustomOrderService } from "./services/custom-order.service";
import { ShopItemSelectionService } from "./services/shop-item-selection.service";
import { AuthenticationService } from './shared/internal-services/authentication.service';
// import { Plugins, NetworkStatus } from '@capacitor/core';
// const { Network } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private previousAuthState: boolean = false;
  private networkStatusSubs: Subscription;
  // private status: NetworkStatus;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    // private authService: AuthService,
    private router: Router,
    private networkService: NetworkService,
    private messageService: MessageService,
    private angularFireAuth: AngularFireAuth,
    private customOrderService: CustomOrderService,
    private shopItemSelectionService: ShopItemSelectionService,
    private authenticationService: AuthenticationService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    // this.angularFireAuth.auth.onAuthStateChanged(user => {
    //   console.log("Auth State changed User STatus **********", user);
    //   if (!user) {
    //     this.router.navigateByUrl("/homepage/tabs");
    //   }
    // });
    // this.authService.userAuthState.subscribe(isAuth => {
    //   console.log("isAuth New AuthstateChanged *****",isAuth);
    //   if (!isAuth) {
    //     this.router.navigateByUrl("/homepage/tabs");
    //   }
    // })
    // this.authenticationService.autoLogin().subscribe()
    /*

if (userRole === "ENTERPRISE_PARTNER") {
            this.loginSuccessToastControllerMessage();
            this.onCloseLoginSuccess('ENTERPRISE_PARTNER');
          } else if (userRole === "GENERAL_ADMIN") {
            this.loginSuccessToastControllerMessage();
            this.onCloseLoginSuccess('GENERAL_ADMIN');
          } else {
            await this.authObjObsSubs.unsubscribe();
            this.loginSuccessToastControllerMessage();
            this.onCloseLoginSuccess('CUSTOMER');
          }


    */
    this.authenticationService.userAuthState.subscribe(isAuth => {
      console.log("isAuth New AuthstateChanged *****", isAuth);
      if (!isAuth) {
        this.router.navigateByUrl("/homepage/tabs");
      } else {
        const parsedAuthData = JSON.parse(isAuth.value) as {
          token: string;
          userId: string;
          tokenExpirationDate: string;
          email: string;
          username: string;
          role: string;
        };
        console.log("Cmae in Else Part ******");
        if (parsedAuthData.role === 'ENTERPRISE_PARTNER') {
          this.router.navigateByUrl("/partnerHomePage/partnerTabs");
        } else if (parsedAuthData.role === 'GENERAL_ADMIN') {
          this.router.navigateByUrl("/adminHomePage/adminTab");
        } else {
          this.router.navigateByUrl("/homepage/tabs");
        }
      }
    });
    this.shopItemSelectionService
      .getOrderedItemsFromLocalStorage()
      .subscribe(localStorageUserSelection => {
        const userSelectionsFromLocalStorage = JSON.parse(
          localStorageUserSelection.value
        );
        // console.log("userSelectionsFromLocalStorage userSelectionsFromLocalStorage App Component", userSelectionsFromLocalStorage);
        if (userSelectionsFromLocalStorage) {
          if (
          userSelectionsFromLocalStorage.selectableItems &&
          userSelectionsFromLocalStorage.customItemsKG &&
          userSelectionsFromLocalStorage.customItemsPacks
        ) {
          this.customOrderService.addLocalStorageItemsToCart(
            userSelectionsFromLocalStorage.selectableItems
              ? userSelectionsFromLocalStorage.selectableItems
              : [],
            userSelectionsFromLocalStorage.customItemsPacks
              ? userSelectionsFromLocalStorage.customItemsPacks
              : [],
            userSelectionsFromLocalStorage.customItemsKG
              ? userSelectionsFromLocalStorage.customItemsKG
              : []
          );
        }}
      });
    // this.authSubscription = this.authService.userIsAuthenticated.subscribe(isAuth => {
    //   console.log("IS Auth *******", isAuth);
    //   // console.log("this.previousAuthState", this.previousAuthState);
    //   if (!isAuth && this.previousAuthState !== isAuth) {
    //   // if (!isAuth) {
    //     // console.log("Came inside if logged out condition");
    //     // this.router.navigateByUrl('/auth');
    //     this.router.navigateByUrl("/homepage/tabs");
    //   }
    //   this.previousAuthState = isAuth;

    //   console.log("previousAuthState *******", this.previousAuthState);
    // });
    this.networkStatusSubs = this.networkService
      .checkNetworkStatus()
      .subscribe(networkData => {
        if (!networkData.connected) {
          this.messageService.sendNetworkStatusMessage({
            NETWORK_CONNECTION: false
          });
        } else {
          this.messageService.sendNetworkStatusMessage({
            NETWORK_CONNECTION: true
          });
        }
      });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.networkStatusSubs) {
      this.networkStatusSubs.unsubscribe();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    // this.getAuthState();
    // this.checkNetworkStatus();
  }

  // async checkNetworkStatus() {
  //   try {
  //     this.status = await Network.getStatus();
  //     console.log("This.status *********", this.status);
  //   } catch (e) { console.log("Error", e); }
  // }

  // getAuthState() {
  //   this.authService.getAuthState()
  //     .subscribe(authData => {
  //       const authStateData = authData.toJSON();
  //       // console.log("ExpirationTime ********", new Date(authStateData['stsTokenManager'].expirationTime));
  //     }, error => {
  //       // console.log("Error in Auth State ******", error);
  //     });
  // }
}
