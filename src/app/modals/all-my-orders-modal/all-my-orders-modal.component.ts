import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { IUserFinalOrder } from 'src/app/models/user-final-order.model';
import { SortByService } from 'src/app/shared/utils/sort-by.service';

@Component({
  selector: 'app-all-my-orders-modal',
  templateUrl: './all-my-orders-modal.component.html',
  styleUrls: ['./all-my-orders-modal.component.scss'],
})
export class AllMyOrdersModalComponent implements OnInit {

  // public myOrdersList
  public myAllOrders: IUserFinalOrder[] = [];

  constructor(private allOrdersModalCtrl: ModalController,
              private userProfileService: UserProfileService,
              private sortByService: SortByService) { }

  ngOnInit() {
    // const userOrders =
    this.userProfileService.getCustomerAllOrder()
    .then(allOrders => {
      this.myAllOrders = this.sortByService.sortLatestToOld(allOrders);
      // this.
      console.log("this.myAllOrders >>>> this.myAllOrders >>>>", this.myAllOrders);
    })
    .catch (e => {
      this.myAllOrders = [];
    });
    // console.log("User Orders *********",userOrders);
  }

  onClose() {
    this.allOrdersModalCtrl.dismiss(null, "closed", "allOrdersModal");
  }

}
