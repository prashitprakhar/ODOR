import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-account-details',
  templateUrl: './partner-account-details.page.html',
  styleUrls: ['./partner-account-details.page.scss'],
})
export class PartnerAccountDetailsPage implements OnInit {

  public userProfile: any = {};

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getAuthState().subscribe(userProfileData => {
      const userProfileInfo = userProfileData.toJSON();
      this.userProfile.email = userProfileInfo['email'];
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
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
