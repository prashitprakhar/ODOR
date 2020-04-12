import { Component, OnInit } from "@angular/core";
import { ShopProfileService } from "src/app/services/shop-profile.service";

@Component({
  selector: "app-partner-order-list",
  templateUrl: "./partner-order-list.page.html",
  styleUrls: ["./partner-order-list.page.scss"],
})
export class PartnerOrderListPage implements OnInit {
  public isAllOrdersDataLoaded: boolean = false;
  public allOrders: any[] = [];
  public allActiveOrders: any[] = [];
  public allCompletedOrders: any[] = [];
  public isActiveOrdersSelected: boolean = true;
  public isAllOrdersSelected: boolean = false;
  public isCompletedOrdersSelected: boolean = false;

  constructor(private shopProfileService: ShopProfileService) {}

  ngOnInit() {
    this.shopProfileService
      .getActiveOrders()
      .then((allOrders) => {
        this.allOrders = allOrders;
        console.log("ALL Orders On INIT****#####", this.allOrders);
      })
      .catch((err) => {
        this.allOrders = [];
      });
  }

  ionViewWillEnter() {
    this.shopProfileService
      .getActiveOrders()
      .then((allOrdersResponse) => {
        this.allOrders = [];
        const ordersResp = allOrdersResponse;
        ordersResp.forEach((eachUserElement) => {
          // this.allOrders.push(eachUserElement.ordersList);
          const ordersList = eachUserElement.ordersList;
          this.allOrders = [...this.allOrders, ...ordersList];
          this.allActiveOrders = [];
          this.allActiveOrders = this.allOrders.filter(
            (eachOrderElement) => eachOrderElement.orderStatus === "PROGRESS"
          );
          setTimeout(() => {
            this.isAllOrdersDataLoaded = true;
          }, 3000);
        });
        // this.allOrders =
        console.log("All Active Orders ****#####", this.allActiveOrders);
      })
      .catch((err) => {
        this.allOrders = [];
        this.isAllOrdersDataLoaded = false;
      });
  }

  doRefresh(event?) {
    console.log("Begin async operation");
    this.isAllOrdersDataLoaded = false;
    this.getUpdatedOrdersList(event);
  }

  async getUpdatedOrdersList(event?) {
    const allOrdersResponse = await this.shopProfileService.getActiveOrders();
    this.allOrders = [];
    const ordersResp = allOrdersResponse;
    ordersResp.forEach((eachUserElement) => {
      const ordersList = eachUserElement.ordersList;
      this.allOrders = [...this.allOrders, ...ordersList];
      this.allActiveOrders = [];
      this.allActiveOrders = this.allOrders.filter(
        (eachOrderElement) => eachOrderElement.orderStatus === "PROGRESS"
      );
      setTimeout(() => {
        event.target.complete();
        this.isAllOrdersDataLoaded = true;
      }, 3000);
    });
    console.log("All Active Orders ****#####", this.allActiveOrders);
  }

  segmentChanged($event) {
    console.log("SEGMENT CHANGE EVENT TRIGGERED ######", $event);
    if ($event.detail.value === "ACTIVE_ORDERS") {
      this.isActiveOrdersSelected = true;
      this.isAllOrdersSelected = false;
      this.isCompletedOrdersSelected = false;
      this.allActiveOrders = [];
    }
    if ($event.detail.value === "ALL_ORDERS") {
      console.log("ALl Orders");
      this.isActiveOrdersSelected = false;
      this.isAllOrdersSelected = true;
      this.isCompletedOrdersSelected = false;
    }
    if ($event.detail.value === "COMPLETED_ORDERS") {
      console.log("Completed Orders");
      this.isActiveOrdersSelected = false;
      this.isAllOrdersSelected = false;
      this.isCompletedOrdersSelected = true;
    }
  }

  allOrdersForShop() {}

  ordersInProgress() {}

  completedOrders() {}
}
