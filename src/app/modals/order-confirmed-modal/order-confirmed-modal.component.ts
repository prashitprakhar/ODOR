import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NavParams } from "@ionic/angular";
import { UserProfileService } from "src/app/services/user-profile.service";
import { IUserFinalOrder } from "src/app/models/user-final-order.model";

@Component({
  selector: "app-order-confirmed-modal",
  templateUrl: "./order-confirmed-modal.component.html",
  styleUrls: ["./order-confirmed-modal.component.scss"]
})
export class OrderConfirmedModalComponent implements OnInit {
  public orderId: string;
  public currentOrderDetails: IUserFinalOrder[] = [];
  public hasCustomItems: boolean = false;

  constructor(
    private orderConfModalCtrl: ModalController,
    private navParams: NavParams,
    private userProfileService: UserProfileService
  ) {
    this.orderId = navParams.get("orderId");
  }

  ngOnInit() {
    this.currentOrderDetails = this.userProfileService.getUserOrder();
    const customItemsOrdered = this.currentOrderDetails[0].ordersList.find(
      element => element.orderType === "CUSTOM"
    );
    if (customItemsOrdered) {
      this.hasCustomItems = true;
    } else {
      this.hasCustomItems = false;
    }
  }

  onClose() {
    this.orderConfModalCtrl.dismiss(null, "closed", "orderConfModal");
  }
}
