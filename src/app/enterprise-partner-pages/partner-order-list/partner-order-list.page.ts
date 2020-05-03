import { Component, OnInit } from "@angular/core";
import { ShopProfileService } from "src/app/services/shop-profile.service";
import {
  ModalController,
  AlertController,
  LoadingController,
} from "@ionic/angular";
import { OrderItemsDetailsComponent } from "src/app/enterprise-partner-modals/order-items-details/order-items-details.component";
import { SortByService } from "src/app/shared/utils/sort-by.service";

@Component({
  selector: "app-partner-order-list",
  templateUrl: "./partner-order-list.page.html",
  styleUrls: ["./partner-order-list.page.scss"],
})
export class PartnerOrderListPage implements OnInit {
  public isAllOrdersDataLoaded: boolean = false;
  public showAllOrders: boolean = false;
  public showCompletedOrders: boolean = false;
  public allOrders: any[] = [];
  public allActiveOrders: any[] = [];
  public isActiveOrdersSelected: boolean = true;
  public isAllOrdersSelected: boolean = false;
  public isCompletedOrdersSelected: boolean = false;
  public allOrdersResponse: any[] = [];
  public allOrdersArray: any[] = [];
  public allCompletedOrders: any[] = [];

  constructor(
    private shopProfileService: ShopProfileService,
    private orderItemDetailsModalCtrl: ModalController,
    private sortByService: SortByService,
    private markOrderOutForDeliveryAlertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.allOrdersResponse = [];
    this.shopProfileService
      .getActiveOrders()
      .then((allOrders) => {
        this.allOrders = allOrders;
        this.allOrdersResponse = allOrders;
      })
      .catch((err) => {
        this.allOrders = [];
        this.allOrdersResponse = [];
      });
  }

  ionViewWillEnter() {
    this.allOrdersResponse = [];
    this.shopProfileService
      .getActiveOrders()
      .then((allOrdersResponse) => {
        this.allOrders = [];
        const ordersResp = allOrdersResponse;
        this.allOrdersResponse = allOrdersResponse;
        this.allOrders = allOrdersResponse;
        if (ordersResp.length > 0) {
          ordersResp.forEach((eachUserElement) => {
            const ordersList = eachUserElement.ordersList;
            this.allOrders = [...this.allOrders, ...ordersList];
            this.allActiveOrders = [];
            const activeOrdersList = this.allOrders.filter(
              (eachOrderElement) =>
                eachOrderElement.orderStatus === "PROGRESS" ||
                eachOrderElement.orderStatus === "PACKED" ||
                eachOrderElement.orderStatus === "OUTFORDELIVERY"
            );
            if (activeOrdersList.length > 0) {
              this.allActiveOrders = this.sortByService.sortOrdersByTimestamp(
                activeOrdersList
              );
            }
            setTimeout(() => {
              this.isAllOrdersDataLoaded = true;
            }, 1000);
          });
        } else {
          setTimeout(() => {
            this.isAllOrdersDataLoaded = true;
          }, 1000);
        }
      })
      .catch((err) => {
        this.allOrders = [];
        this.allActiveOrders = [];
        this.isAllOrdersDataLoaded = true;
      });
  }

  doRefresh(event?) {
    this.isAllOrdersDataLoaded = false;
    this.getUpdatedOrdersList(event);
  }

  async getUpdatedOrdersList(event?) {
    const allOrdersResponse = await this.shopProfileService.getActiveOrders();
    this.allOrders = [];
    const ordersResp = allOrdersResponse;
    if (ordersResp.length > 0) {
      ordersResp.forEach((eachUserElement) => {
        const ordersList = eachUserElement.ordersList;
        this.allOrders = [...this.allOrders, ...ordersList];
        this.allActiveOrders = [];
        const activeOrdersList = this.allOrders.filter(
          (eachOrderElement) =>
            eachOrderElement.orderStatus === "PROGRESS" ||
            eachOrderElement.orderStatus === "PACKED" ||
            eachOrderElement.orderStatus === "OUTFORDELIVERY"
        );
        if (activeOrdersList.length > 0) {
          this.allActiveOrders = this.sortByService.sortOrdersByTimestamp(
            activeOrdersList
          );
        }
        setTimeout(() => {
          event.target.complete();
          this.isAllOrdersDataLoaded = true;
        }, 1000);
      });
    } else {
      setTimeout(() => {
        event.target.complete();
        this.isAllOrdersDataLoaded = true;
      }, 1000);
    }
  }

  async getUpdatedOrdersListWithoutRefresh() {
    const allOrdersResponse = await this.shopProfileService.getActiveOrders();
    this.allOrders = [];
    const ordersResp = allOrdersResponse;
    ordersResp.forEach((eachUserElement) => {
      const ordersList = eachUserElement.ordersList;
      this.allOrders = [...this.allOrders, ...ordersList];
      this.allActiveOrders = [];
      const activeOrdersList = this.allOrders.filter(
        (eachOrderElement) =>
          eachOrderElement.orderStatus === "PROGRESS" ||
          eachOrderElement.orderStatus === "PACKED" ||
          eachOrderElement.orderStatus === "OUTFORDELIVERY"
      );
      if (activeOrdersList.length > 0) {
        this.allActiveOrders = this.sortByService.sortOrdersByTimestamp(
          activeOrdersList
        );
      }
      this.isAllOrdersDataLoaded = true;
    });
  }

  segmentChanged($event) {
    if ($event.detail.value === "ACTIVE_ORDERS") {
      this.isActiveOrdersSelected = true;
      this.isAllOrdersSelected = false;
      this.isCompletedOrdersSelected = false;
      this.getUpdatedOrdersListWithoutRefresh();
    }
    if ($event.detail.value === "ALL_ORDERS") {
      this.showAllOrders = false;
      this.isActiveOrdersSelected = false;
      this.isAllOrdersSelected = true;
      this.isCompletedOrdersSelected = false;
      this.allOrdersDetails();
    }
    if ($event.detail.value === "COMPLETED_ORDERS") {
      this.showCompletedOrders = false;
      this.isActiveOrdersSelected = false;
      this.isAllOrdersSelected = false;
      this.isCompletedOrdersSelected = true;
      this.getCompletedOrders();
    }
  }

  async getCompletedOrders() {
    this.allCompletedOrders = [];
    const completedOrders = await this.shopProfileService.getCompletedOrders();
    completedOrders.forEach((eachOrder) => {
      this.allCompletedOrders = [...this.allCompletedOrders, ...eachOrder];
    });
    this.allCompletedOrders = this.sortByService.sortLatestToOld(
      this.allCompletedOrders
    );
    if (completedOrders) {
      setTimeout(() => {
        this.showCompletedOrders = true;
      }, 1000);
    } else {
      setTimeout(() => {
        this.showCompletedOrders = true;
      }, 1000);
    }
  }

  async allOrdersDetails() {
    this.allOrdersArray = [];
    const allOrdersForShop = await this.shopProfileService.getAllOrdersForShop();
    allOrdersForShop.forEach((eachOrder) => {
      this.allOrdersArray = [...this.allOrdersArray, ...eachOrder.ordersList];
    });
    this.allOrdersArray = this.sortByService.sortLatestToOld(
      this.allOrdersArray
    );
    if (allOrdersForShop) {
      setTimeout(() => {
        this.showAllOrders = true;
      }, 1000);
    } else {
      setTimeout(() => {
        this.showAllOrders = false;
      }, 1000);
    }
  }

  seeOrderDetails(order) {
    // console.log("ORDER ID ###", order);

    this.openOrderDetailsModal(order);
  }

  openOrderDetailsModal(order) {
    this.orderItemDetailsModalCtrl
      .create({
        component: OrderItemsDetailsComponent,
        componentProps: {
          name: "orderItemDetailsModal",
          // selectedShopId: this.shopId,
          product: order,
          allOrders: this.allOrdersResponse,
        },
        id: "orderItemDetailsModal",
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((data) => {
        console.log("On Modal Close Data received ###", data);
        // Promise.all([this.getShopProfile(), this.getShopOfferedItemsList()])
        //   .then(dataRes => {})
        //   .catch(err => {
        //     this.shopOfferedItemsData = {
        //       shopId: this.shopId,
        //       shopOfferedItemsList: []
        //     };
        //     this.shopProfile = null;
        //   });
      });
  }

  outForDelivery(orderId) {
    const alert = this.markOrderOutForDeliveryAlertCtrl
      .create({
        header: "Are you sure the items are Out For Delivery ?",
        buttons: [
          {
            text: "Yes",
            cssClass: "secondary",
            handler: (cancel) => {
              let currentOrderDetails;
              this.allOrdersResponse.forEach((eachOrder) => {
                const currentOrder = eachOrder.ordersList.find(
                  (element) => element.orderId === orderId
                );
                if (currentOrder) {
                  currentOrderDetails = eachOrder;
                }
              });
              this.persistOrderStatus(
                currentOrderDetails.userId,
                orderId,
                "OUTFORDELIVERY",
                currentOrderDetails.orderStatus
              );
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {},
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  markOrderComplete(orderId) {
    const alert = this.markOrderOutForDeliveryAlertCtrl
      .create({
        header: "Are you sure the items are Delivered ?",
        buttons: [
          {
            text: "Yes",
            cssClass: "secondary",
            handler: (cancel) => {
              let currentOrderDetails;
              this.allOrdersResponse.forEach((eachOrder) => {
                const currentOrder = eachOrder.ordersList.find(
                  (element) => element.orderId === orderId
                );
                if (currentOrder) {
                  currentOrderDetails = eachOrder;
                }
              });
              this.persistOrderStatus(
                currentOrderDetails.userId,
                orderId,
                "COMPLETE",
                currentOrderDetails.orderStatus
              );
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {},
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  markPaymentComplete(orderId) {
    let currentOrderDetails;
    let orderList;
    this.allOrdersResponse.forEach((eachOrder) => {
      const currentOrder = eachOrder.ordersList.find(
        (element) => element.orderId === orderId
      );
      if (currentOrder) {
        currentOrderDetails = eachOrder;
        orderList = currentOrder.orderedItemsList;
      }
    });
    /*
    this.grandTotal = this.selectableOrders.reduce(function (
        accumulator,
        item
      ) {
        return accumulator + item.totalPrice;
      },
      0);
    */
    const totalAmountPayble = orderList.reduce((accumulator, item) => {
      return accumulator + item.totalPrice;
    }, 0);
    const alert = this.markOrderOutForDeliveryAlertCtrl
      .create({
        header: `Are you sure the Payment of Rs. ${this.payableAmount(
          orderId
        )} is complete ?`,
        buttons: [
          {
            text: "Yes",
            cssClass: "secondary",
            handler: (cancel) => {
              this.persistOrderPaymentStatus(
                currentOrderDetails.userId,
                orderId,
                true,
                false
              );
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {},
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
    // this.shopProfileService.changePaymentStatus();
  }

  async persistOrderPaymentStatus(
    userId,
    orderId,
    paymentStatus: boolean,
    previousOrderStatus: boolean
  ) {
    this.loadingCtrl
      .create({
        message: "Updating ...",
      })
      .then(async (loadingEl) => {
        loadingEl.present();
        const updatedOrderStatus = await this.shopProfileService.changePaymentStatus(
          userId,
          orderId,
          paymentStatus,
          previousOrderStatus
        );
        if (updatedOrderStatus) {
          this.isAllOrdersDataLoaded = true;
          this.allOrdersDetails();
          loadingEl.dismiss();
        } else {
          loadingEl.dismiss();
          this.failureAlertMessage();
        }
      });
  }

  payableAmount(orderId) {
    let orderList;
    this.allOrdersResponse.forEach((eachOrder) => {
      const currentOrder = eachOrder.ordersList.find(
        (element) => element.orderId === orderId
      );
      if (currentOrder) {
        orderList = currentOrder.orderedItemsList;
      }
    });
    const totalAmountPayble = orderList.reduce((accumulator, item) => {
      return accumulator + item.totalPrice;
    }, 0);

    return totalAmountPayble;
  }

  async persistOrderStatus(
    userId,
    orderId,
    orderStatus: string,
    previousOrderStatus: string
  ) {
    this.loadingCtrl
      .create({
        message: "Updating ...",
      })
      .then(async (loadingEl) => {
        loadingEl.present();
        const updatedOrderStatus = await this.shopProfileService.changeOrderStatus(
          userId,
          orderId,
          orderStatus,
          previousOrderStatus
        );
        if (updatedOrderStatus) {
          this.isAllOrdersDataLoaded = false;
          this.getUpdatedOrdersListWithoutRefresh();
          loadingEl.dismiss();
        } else {
          loadingEl.dismiss();
          this.failureAlertMessage();
        }
      });
  }

  failureAlertMessage() {
    const alert = this.markOrderOutForDeliveryAlertCtrl
      .create({
        header: "Oops... Something went wrong",
        message: "Please try again.",
        buttons: [
          {
            text: "OK",
            cssClass: "secondary",
            handler: (cancel) => {},
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  allOrdersForShop() {}

  ordersInProgress() {}

  completedOrders() {}

  /*
   **
   ** UTILITY FUNCTION
   ** FOR CALCULATING REMIANING TIME
   **
   */

  calculateRemianingTime(deliveryTime) {
    const deliveryDateTime: any = new Date(deliveryTime);
    const currentTime: any = new Date();
    const diffTime = deliveryDateTime - currentTime;
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    return diffMinutes;
  }
}
