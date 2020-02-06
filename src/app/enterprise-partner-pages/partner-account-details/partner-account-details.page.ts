import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/internal-services/authentication.service';

@Component({
  selector: 'app-partner-account-details',
  templateUrl: './partner-account-details.page.html',
  styleUrls: ['./partner-account-details.page.scss'],
})
export class PartnerAccountDetailsPage implements OnInit {

  public userProfile: any = {};

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
