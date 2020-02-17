import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/internal-services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-partner-account-details',
  templateUrl: './partner-account-details.page.html',
  styleUrls: ['./partner-account-details.page.scss'],
})
export class PartnerAccountDetailsPage implements OnInit, OnDestroy {

  public userProfile: any = {};
  public isUserLoggedIn: boolean = false;
  private authStateSubs: Subscription;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // this.authService.getAuthState().subscribe(userProfileData => {
    //   const userProfileInfo = userProfileData.toJSON();
    //   this.userProfile.email = userProfileInfo['email'];
    // });
  }

  onLogout() {
    // this.authService.logout();
    // this.router.navigateByUrl('/auth');
    this.authenticationService.logout();
  }

  ngOnDestroy() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }

  ionViewDidEnter() {
    this.authStateSubs = this.authenticationService.userAuthState.subscribe(
      userAuthState => {
        if (!userAuthState || !userAuthState.value) {
          this.isUserLoggedIn = false;
          // this.showLoginSignupScreen();
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

  // myAllOrders() {
  //   this.allOrdersModalCtrl
  //     .create({
  //       component: AllMyOrdersModalComponent,
  //       id: "allOrdersModal"
  //     })
  //     .then(modalEl => {
  //       modalEl.present();
  //       return modalEl.onDidDismiss();
  //     })
  //     .then(data => {
  //     });
  // }

}
