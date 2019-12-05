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
  // public currentHour: number;
  // public deliveryHour: number;
  // public currentMin: number;
  // public currentDate: number;
  // public currentMonth: string;
  // public currentYear: number;
  // public deliveryDateTime: string;

  constructor(
    private orderConfModalCtrl: ModalController,
    private navParams: NavParams,
    private userProfileService: UserProfileService
  ) {
    this.orderId = navParams.get("orderId");
    // const dateObj = new Date();
    // this.currentDate = dateObj.getDate();
    // //this.currentHour = dateObj.getHours();
    // this.currentMin = dateObj.getMinutes();
    // // this.currentMonth = dateObj.getMonth();
    // this.currentYear = dateObj.getFullYear();
    // this.deliveryHour = this.hourConverter();
    // this.currentMonth = this.monthConverter(dateObj.getMonth());
    // tslint:disable-next-line: max-line-length
    // this.deliveryDateTime = `${this.deliveryHour}:${this.currentMin} ${this.amPmTracker()}, ${this.currentDate} ${this.currentMonth} ${this.currentYear}`

  }

  // hourConverter(): number {
  //   const dateObj = new Date();
  //   const currentHour = dateObj.getHours() + 1;
  //   let twelveHourFormatDate = 0;
  //   if (currentHour <= 12) {
  //     twelveHourFormatDate = currentHour;
  //   } else {
  //     twelveHourFormatDate = currentHour - 12;
  //   }
  //   return twelveHourFormatDate;
  // }

  // amPmTracker(): string {
  //   const dateObj = new Date();
  //   const currentHour = dateObj.getHours() + 1;
  //   let amPmText = '';
  //   if (currentHour <= 12) {
  //     amPmText = 'AM';
  //   } else {
  //     amPmText = 'PM';
  //   }
  //   return amPmText;
  // }

  // monthConverter(monthNumber): string {
  //   let monthText = "";
  //   switch (monthNumber) {
  //     case 1:
  //       monthText = "Jan";
  //       break;
  //     case 2:
  //       monthText = "Feb";
  //       break;
  //     case 3:
  //       monthText = "Mar";
  //       break;
  //     case 4:
  //       monthText = "Apr";
  //       break;
  //     case 5:
  //       monthText = "May";
  //       break;
  //     case 6:
  //       monthText = "Jun";
  //       break;
  //     case 7:
  //       monthText = "Jul";
  //       break;
  //     case 8:
  //       monthText = "Aug";
  //       break;
  //     case 9:
  //       monthText = "Sep";
  //       break;
  //     case 10:
  //       monthText = "Oct";
  //       break;
  //     case 11:
  //       monthText = "Nov";
  //       break;
  //     case 12:
  //       monthText = "Dec";
  //       break;
  //   }
  //   return monthText;
  // }

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
