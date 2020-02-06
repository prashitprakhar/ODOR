import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { ModalController, ActionSheetController } from "@ionic/angular";
import { AllMyOrdersModalComponent } from "src/app/modals/all-my-orders-modal/all-my-orders-modal.component";
import { LoginModalComponent } from "src/app/shared/modals/login-modal/login-modal.component";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/app/shared/internal-services/authentication.service";
// import { IAuththenticationResponse } from 'src/app/shared/models/authentication-response.model';

@Component({
  selector: "app-account-details",
  templateUrl: "./account-details.page.html",
  styleUrls: ["./account-details.page.scss"]
})
export class AccountDetailsPage implements OnInit, OnDestroy {
  public userProfile: any = {};
  public isUserLoggedIn: boolean = false;
  private authStateSubs: Subscription;

  constructor(
    // private authService: AuthService,
    private router: Router,
    private allOrdersModalCtrl: ModalController,
    private loginModalCtrl: ModalController,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    // this.authStateSubs = this.authService
    //   .getAuthState()
    //   .subscribe(userProfileData => {
    //     if (userProfileData) {
    //       const userProfileInfo = userProfileData.toJSON();
    //       this.userProfile.email = userProfileInfo["email"];
    //       this.isUserLoggedIn = true;
    //     } else {
    //       this.isUserLoggedIn = false;
    //     }
    //   });
          // this.authStateSubs = this.authenticationService.userAuthState.subscribe(
          //   userAuthState => {
          //     if (!userAuthState || !userAuthState.value) {
          //       this.isUserLoggedIn = false;
          //       this.showLoginSignupScreen();
          //     } else {
          //       const parsedAuthData = JSON.parse(userAuthState.value) as {
          //         token: string;
          //         userId: string;
          //         tokenExpirationDate: string;
          //         email: string;
          //         username: string;
          //       };
          //       this.userProfile.email = parsedAuthData.email;
          //       this.isUserLoggedIn = true;
          //     }
          //   }
          // );
  }

  ngOnDestroy() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }

  ionViewWillEnter() {
    // this.authStateSubs = this.authService
    //   .getAuthState()
    //   .subscribe(userProfileData => {
    //     if (userProfileData) {
    //       const userProfileInfo = userProfileData.toJSON();
    //       this.userProfile.email = userProfileInfo["email"];
    //       this.isUserLoggedIn = true;
    //     } else {
    //       this.isUserLoggedIn = false;
    //     }
    //   });
          // this.authStateSubs = this.authenticationService.userAuthState.subscribe(
          //   userAuthState => {
          //     if (!userAuthState || !userAuthState.value) {
          //       this.isUserLoggedIn = false;
          //       this.showLoginSignupScreen();
          //     } else {
          //       const parsedAuthData = JSON.parse(userAuthState.value) as {
          //         token: string;
          //         userId: string;
          //         tokenExpirationDate: string;
          //         email: string;
          //         username: string;
          //       };
          //       this.userProfile.email = parsedAuthData.email;
          //       this.isUserLoggedIn = true;
          //     }
          //   }
          // );
  }

  ionViewDidEnter() {
    // this.authStateSubs = this.authService
    //   .getAuthState()
    //   .subscribe(userProfileData => {
    //     if (userProfileData) {
    //       const userProfileInfo = userProfileData.toJSON();
    //       this.userProfile.email = userProfileInfo["email"];
    //       this.isUserLoggedIn = true;
    //     } else {
    //       this.isUserLoggedIn = false;
    //       this.showLoginSignupScreen();
    //     }
    //   });
    this.authStateSubs = this.authenticationService.userAuthState.subscribe(
      userAuthState => {
        if (!userAuthState || !userAuthState.value) {
          this.isUserLoggedIn = false;
          this.showLoginSignupScreen();
        } else {
          const parsedAuthData = JSON.parse(userAuthState.value) as {
            token: string;
            userId: string;
            tokenExpirationDate: string;
            email: string;
            username: string;
          };
          this.userProfile.email = parsedAuthData.email;
          this.isUserLoggedIn = true;
        }
      }
    );
  }

  ionViewDidLeave() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }

  onLogout() {
    // this.authService.logout();
    this.authenticationService.logout();
  }

  showLoginSignupScreen() {
    this.loginModalCtrl
      .create({
        component: LoginModalComponent,
        id: "loginModal"
      })
      .then(loginModalEl => {
        loginModalEl.present();
        return loginModalEl.onDidDismiss();
      })
      .then(data => {
        console.log("came here on close")
        if (data.role === "LOGIN_SUCCESS") {
          if (data.data === "ENTERPRISE_PARTNER") {
            this.router.navigateByUrl("/partnerHomePage/partnerTabs");
          } else if (data.data === "GENERAL_ADMIN") {
            this.router.navigateByUrl("/adminHomePage/adminTab");
          } else if (data.data === "CUSTOMER") {
            // this.router.navigateByUrl("/homepage/tabs/account");
            this.router.navigateByUrl("/homepage/tabs");
          }
        } else {
          this.router.navigateByUrl("/homepage/tabs");
        }
      });
  }

  myAllOrders() {
    this.allOrdersModalCtrl
      .create({
        component: AllMyOrdersModalComponent,
        id: "allOrdersModal"
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(data => {});
  }
}
