import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AllMyOrdersModalComponent } from 'src/app/modals/all-my-orders-modal/all-my-orders-modal.component';
import { IAuththenticationResponse } from 'src/app/shared/models/authentication-response.model';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.page.html',
  styleUrls: ['./account-details.page.scss'],
})
export class AccountDetailsPage implements OnInit {

  public userProfile: any = {};

  constructor(private authService: AuthService, private router: Router,
              private allOrdersModalCtrl: ModalController) { }

  ngOnInit() {
    this.authService.getAuthState().subscribe(userProfileData => {
      const userProfileInfo = userProfileData.toJSON();
      this.userProfile.email = userProfileInfo['email'];
    });
  }

  onLogout() {
    this.authService.logout();
    // this.router.navigateByUrl('/auth');
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
