import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { AllMyOrdersModalComponent } from 'src/app/modals/all-my-orders-modal/all-my-orders-modal.component';
import { LoginModalComponent } from 'src/app/shared/modals/login-modal/login-modal.component';
import { Subscription } from 'rxjs';
// import { IAuththenticationResponse } from 'src/app/shared/models/authentication-response.model';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.page.html',
  styleUrls: ['./account-details.page.scss'],
})
export class AccountDetailsPage implements OnInit, OnDestroy {

  public userProfile: any = {};
  public isUserLoggedIn: boolean = false;
  private authStateSubs: Subscription;

  constructor(private authService: AuthService, private router: Router,
              private allOrdersModalCtrl: ModalController,
              private loginModalCtrl: ModalController) { }

  ngOnInit() {
    this.authStateSubs = this.authService.getAuthState().subscribe(userProfileData => {
      console.log("userProfileInfo", userProfileData);
      if (userProfileData) {
        const userProfileInfo = userProfileData.toJSON();
        this.userProfile.email = userProfileInfo['email'];
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
        this.showLoginSignupScreen();
      }
    });
  }

  ngOnDestroy() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.authStateSubs = this.authService.getAuthState().subscribe(userProfileData => {
      console.log("userProfileInfo ion view", userProfileData);
      if (userProfileData) {
        const userProfileInfo = userProfileData.toJSON();
        this.userProfile.email = userProfileInfo['email'];
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
        this.showLoginSignupScreen();
      }
    });
  }

  ionViewDidEnter() {
    this.authStateSubs = this.authService.getAuthState().subscribe(userProfileData => {
      console.log("userProfileInfo ion view did enter", userProfileData);
      if (userProfileData) {
        const userProfileInfo = userProfileData.toJSON();
        this.userProfile.email = userProfileInfo['email'];
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
        this.showLoginSignupScreen();
      }
    });
  }

  ionViewDidLeave() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
    // this.router.navigateByUrl('/auth');
  }

  showLoginSignupScreen() {
    // this.router.navigateByUrl('/auth')
    this.loginModalCtrl
      .create({
        component: LoginModalComponent,
        id: "loginModal"
      })
      .then(loginModalEl => {
        loginModalEl.present();
        console.log("loginModalEl loginModalEl");
        return loginModalEl.onDidDismiss();
      })
      .then(data => {
        console.log("Modal Closd*****", data);
        if (data.role === 'LOGIN_SUCCESS') {
          this.router.navigateByUrl("/homepage/tabs/account");
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
      .then(data => {
      });
  }

}
