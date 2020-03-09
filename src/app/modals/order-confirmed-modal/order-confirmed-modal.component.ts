import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NavParams } from "@ionic/angular";
import { UserProfileService } from "src/app/services/user-profile.service";
import { IUserFinalOrder } from "src/app/models/user-final-order.model";
import { ICustomerAddress } from 'src/app/models/customer-address.model';
import { ICityDetails } from 'src/app/models/city-abbreviation-model';
import { CommonUtilityService } from 'src/app/shared/services/common-utility.service';

@Component({
  selector: "app-order-confirmed-modal",
  templateUrl: "./order-confirmed-modal.component.html",
  styleUrls: ["./order-confirmed-modal.component.scss"]
})
export class OrderConfirmedModalComponent implements OnInit {
  public orderId: string;
  public currentOrderDetails: IUserFinalOrder[] = [];
  public hasCustomItems: boolean = false;
  public deliveryAddress: ICustomerAddress = {};

  constructor(
    private orderConfModalCtrl: ModalController,
    private navParams: NavParams,
    private userProfileService: UserProfileService,
    private commonUtilityService: CommonUtilityService
  ) {
    this.orderId = navParams.get("orderId");
  }

  ngOnInit() {
    this.currentOrderDetails = this.userProfileService.getUserOrder();
    const customItemsOrdered = this.currentOrderDetails[0].orderedItemsList.find(
      element => element.orderType === "CUSTOM"
    );
    this.userProfileService.getCurrentlyUsedAddress().then(currentDeliveryAddress => {
      this.deliveryAddress = currentDeliveryAddress;
    })
    if (customItemsOrdered) {
      this.hasCustomItems = true;
    } else {
      this.hasCustomItems = false;
    }
  }

  getCityFullName(abbr): ICityDetails {
    return this.commonUtilityService.getCityDetails(abbr);
  }

  onClose() {
    this.orderConfModalCtrl.dismiss(null, "closed", "orderConfModal");
  }
}
