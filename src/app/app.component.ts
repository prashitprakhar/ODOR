import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NetworkService } from './shared/services/network.service';
import { MessageService } from './shared/services/message.service';
// import { Plugins, NetworkStatus } from '@capacitor/core';
// const { Network } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
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
    private authService: AuthService,
    private router: Router,
    private networkService: NetworkService,
    private messageService: MessageService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authService.onAuthStateChanged();
    this.authSubscription = this.authService.userIsAuthenticated.subscribe(isAuth => {
      console.log("IS Auth *******", isAuth);
      console.log("this.previousAuthState !== isAuth", this.previousAuthState)
      if (!isAuth && this.previousAuthState !== isAuth) {
        console.log("Came inside if logged out condition");
        // this.router.navigateByUrl('/auth');
        this.router.navigateByUrl("/homepage/tabs");
      }
      this.previousAuthState = isAuth;
    });
    this.networkStatusSubs = this.networkService.checkNetworkStatus().subscribe(networkData => {
      if (!networkData.connected) {
        this.messageService.sendNetworkStatusMessage({NETWORK_CONNECTION : false});
      } else {
        this.messageService.sendNetworkStatusMessage({NETWORK_CONNECTION : true});
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
