import { Component, OnInit } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { NavParams } from "@ionic/angular";
import { ShopProfileService } from "src/app/services/shop-profile.service";

@Component({
  selector: "app-order-items-details",
  templateUrl: "./order-items-details.component.html",
  styleUrls: ["./order-items-details.component.scss"],
})
export class OrderItemsDetailsComponent implements OnInit {
  public product: any;
  public allOrders: any[] = [];
  // public editForm: FormGroup;
  // public shopId: string;

  constructor(
    private orderedItemDetailsModalCtrl: ModalController,
    private navParams: NavParams,
    private markPackedAlertCtrl: AlertController,
    private updateFailureAlertCtrl: AlertController,
    private shopProfileService: ShopProfileService
  ) {
    this.product = navParams.get("product");
    this.allOrders = navParams.get("allOrders");
  }

  ngOnInit() {
    // this.shopId = navParams.get("selectedShopId");
    // console.log("this.product this.product", this.product);
    console.log("this.allOrders this.allOrders", this.allOrders);
  }

  onClose() {
    this.orderedItemDetailsModalCtrl.dismiss(
      null,
      "closed",
      "orderItemDetailsModal"
    );
  }

  markDone($event) {
    if ($event.target.className === "mark_done") {
      $event.target.className = "mark_inprogress";
    } else if ($event.target.className === "mark_inprogress") {
      $event.target.className = "mark_done";
    } else if ($event.target.parentNode.className === "mark_done") {
      $event.target.parentNode.className = "mark_inprogress";
    } else if ($event.target.parentNode.className === "mark_inprogress") {
      $event.target.parentNode.className = "mark_done";
    }
  }

  markOrderPacked() {
    console.log("Order Packed Marked");
    const alert = this.markPackedAlertCtrl
      .create({
        header: "Are you sure the items are packaged ?",
        buttons: [
          {
            text: "Yes",
            // role: "cancel",
            cssClass: "secondary",
            handler: (cancel) => {
              // itemDetailsForm.reset();
              // const userId = this.allOrders.
              // this.persistOrderStatus(this.product.orderStatus, 'PACKED', this.product.orderId, );
              let currentOrderDetails;
              this.allOrders.forEach((eachOrder) => {
                const currentOrder = eachOrder.ordersList.find(
                  (element) => element.orderId === this.product.orderId
                );
                if (currentOrder) {
                  currentOrderDetails = eachOrder;
                }
              });
              // userId, orderId, orderStatus: string, previousOrderStatus: string
              this.persistOrderStatus(
                currentOrderDetails.userId,
                this.product.orderId,
                "PACKED",
                this.product.orderStatus
              );
              // this.product.orderStatus = "PACKED";
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

  async persistOrderStatus(
    userId,
    orderId,
    orderStatus: string,
    previousOrderStatus: string
  ) {
    const updatedOrderStatus = await this.shopProfileService.changeOrderStatus(
      userId,
      orderId,
      orderStatus,
      previousOrderStatus
    );
    if (updatedOrderStatus) {
      this.product.orderStatus = "PACKED";
      this.onClose();
    } else {
      this.updateFailure();
    }
  }

  updateFailure() {
    const alert = this.updateFailureAlertCtrl
      .create({
        header: "Oops... Something went wrong.",
        message: "Please try again.",
        buttons: [
          // {
          //   text: "Yes",
          //   // role: "cancel",
          //   cssClass: "secondary",
          //   handler: (cancel) => {
          //     // itemDetailsForm.reset();
          //     // const userId = this.allOrders.
          //     // this.persistOrderStatus(this.product.orderStatus, 'PACKED', this.product.orderId, );
          //     let currentOrderDetails;
          //     this.allOrders.forEach((eachOrder) => {
          //       const currentOrder = eachOrder.ordersList.find(
          //         (element) => element.orderId === this.product.orderId
          //       );
          //       if (currentOrder) {
          //         currentOrderDetails = currentOrder;
          //       }
          //     });
          //     // userId, orderId, orderStatus: string, previousOrderStatus: string
          //     this.persistOrderStatus(currentOrderDetails.userId, this.product.orderId, 'PACKED', this.product.orderStatus);
          //     // this.product.orderStatus = "PACKED";
          //   },
          // },
          {
            text: "OK",
            role: "cancel",
            handler: () => {},
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
