import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-all-my-orders-modal',
  templateUrl: './all-my-orders-modal.component.html',
  styleUrls: ['./all-my-orders-modal.component.scss'],
})
export class AllMyOrdersModalComponent implements OnInit {

  // public myOrdersList
  constructor(private allOrdersModalCtrl: ModalController,
              private userProfileService: UserProfileService) { }

  ngOnInit() {
    const userOrders = this.userProfileService.getUserOrder();
    console.log("User Orders *********",userOrders)
  }

  onClose() {
    this.allOrdersModalCtrl.dismiss(null, "closed", "allOrdersModal");
  }

}
