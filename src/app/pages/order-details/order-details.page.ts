import { Component, OnInit, OnDestroy } from "@angular/core";
import { CustomOrderService } from "src/app/services/custom-order.service";
import { ICustomOrderItem } from "src/app/models/custom-order-items.model";
import { ISelectableItemsOrder } from "src/app/models/selectable-items-orders.model";
import {
  ActionSheetController,
  ModalController,
  AlertController,
  LoadingController,
} from "@ionic/angular";
import { IUserFinalOrder } from "src/app/models/user-final-order.model";
import { DeliveryTimeService } from "src/app/services/delivery-time.service";
import { UserProfileService } from "src/app/services/user-profile.service";
import { OrderConfirmedModalComponent } from "src/app/modals/order-confirmed-modal/order-confirmed-modal.component";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
import { IShopOfferedItemsData } from "src/app/models/shop-offered-items-data.model";
import { IShopProfile } from "src/app/models/shop-profile.model";
import { CurrentShopProfileService } from "src/app/shared/internal-services/current-shop-profile.service";
import { AuthenticationService } from "src/app/shared/internal-services/authentication.service";
import { Subscription } from "rxjs";
import { LoginModalComponent } from "src/app/shared/modals/login-modal/login-modal.component";
import { MessageService } from "src/app/shared/services/message.service";
import { ICustomerAddress } from "src/app/models/customer-address.model";
import { ViewSavedAddressesModalComponent } from "src/app/modals/view-saved-addresses-modal/view-saved-addresses-modal.component";
import { AddNewAddressModalComponent } from "src/app/modals/add-new-address-modal/add-new-address-modal.component";
import { CommonUtilityService } from "src/app/shared/services/common-utility.service";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.page.html",
  styleUrls: ["./order-details.page.scss"],
})
export class OrderDetailsPage implements OnInit, OnDestroy {
  public customOrdersPacks: ICustomOrderItem[] = [];
  public customOrdersKG: ICustomOrderItem[] = [];
  public selectableOrders: ISelectableItemsOrder[] = [];
  public allOrdersCombined: ICustomOrderItem[] = [];
  public grandTotal: number = 0;
  public userFinalOrder: IUserFinalOrder;
  public selectedShopDetails: IShopOfferedItemsData;
  public isOrderUnplaced: boolean = false;
  public selectedShopName: string;
  public hasCustomOrders: boolean = false;
  public currentHour: number;
  public deliveryHour: number;
  public currentMin: string;
  public currentDate: number;
  public currentMonth: string;
  public currentYear: number;
  public deliveryDateTime: string;
  public shopProfile: IShopProfile;
  public shopId: string;
  public authStateSubs: Subscription;
  public isUserLoggedIn: boolean = false;
  public deliveryAddress: ICustomerAddress;
  public cartItemsShopId: string;
  public cartItemsShopName: string;

  constructor(
    private customOrderService: CustomOrderService,
    private actionSheetCtrl: ActionSheetController,
    private deliveryTimeService: DeliveryTimeService,
    private userProfileService: UserProfileService,
    private orderConfModalCtrl: ModalController,
    private shopItemSelectionService: ShopItemSelectionService,
    private currentShopProfileService: CurrentShopProfileService,
    private authenticationService: AuthenticationService,
    private loginModalCtrl: ModalController,
    private messageService: MessageService,
    private viewSavedAddressesModalCtrl: ModalController,
    private addNewAddressModalCtrl: ModalController,
    private noAddressAlertCtrl: AlertController, // private deliveryAddConfActionCtrl: ActionSheetController
    private placingOrderLoadingCtrl: LoadingController,
    private orderPlacementSuccessCtrl: AlertController,
    private orderPlacementFailureCtrl: AlertController,
    private commonUtilityService: CommonUtilityService,
    private otherOrderInProgressFailureCtrl: AlertController
  ) {}

  ngOnInit() {
    this.selectableOrders = [];
  }

  ngOnDestroy() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }

  ionViewWillLeave() {
    if (this.authStateSubs) {
      this.authStateSubs.unsubscribe();
    }
  }

  findShopIdFromCartItems() {
    if (this.customOrderService.selectableItemsOrders) {
      if (this.customOrderService.selectableItemsOrders.length > 0) {
        // console.log("Shop ID 111111 Selectable-------", this.customOrderService.selectableItemsOrders[0].shopName);
        this.cartItemsShopId = this.customOrderService.selectableItemsOrders[0].shopId;
        this.cartItemsShopName = this.customOrderService.selectableItemsOrders[0].shopName;
      }
    } else if (this.customOrderService.customItemOrdersDetails) {
      if (this.customOrderService.customItemOrdersDetails.length > 0) {
        this.cartItemsShopId = this.customOrderService.customItemOrdersDetails[0].shopId;
        this.cartItemsShopName = this.customOrderService.customItemOrdersDetails[0].shopName;
        // console.log("Shop ID 2222222 KG-------", this.customOrderService.customItemOrdersDetails[0].shopName);
      }
    } else if (this.customOrderService.customItemsPacksOrdersDetails) {
      if (this.customOrderService.customItemsPacksOrdersDetails.length > 0) {
        this.cartItemsShopId = this.customOrderService.customItemsPacksOrdersDetails[0].shopId;
        this.cartItemsShopName = this.customOrderService.customItemsPacksOrdersDetails[0].shopName;
        // console.log("Shop ID 333333 PACK-------", this.customOrderService.customItemsPacksOrdersDetails[0].shopName);
      }
    }
  }

  ionViewWillEnter() {
    this.shopProfile = this.currentShopProfileService.currentShopProfile;
    this.findShopIdFromCartItems();
    const dateObj = new Date();
    this.currentDate = dateObj.getDate();
    const currentMinute = dateObj.getMinutes();
    if (currentMinute < 10) {
      this.currentMin = `0${currentMinute}`;
    } else {
      this.currentMin = `${currentMinute}`;
    }
    this.currentYear = dateObj.getFullYear();
    this.deliveryHour = this.hourConverter();
    this.currentMonth = this.monthConverter(dateObj.getMonth());
    // tslint:disable-next-line: max-line-length
    this.deliveryDateTime = `${this.deliveryHour}:${
      this.currentMin
    } ${this.amPmTracker()}, ${this.currentDate} ${this.currentMonth} ${
      this.currentYear
    }`;

    this.allOrdersCombined = [];
    const allOrders = this.userProfileService.getUserOrder();
    const openOrder =
      allOrders.length > 0
        ? allOrders.find((element) => element.orderPlaced === false)
        : true;
    this.isOrderUnplaced = true;
    this.allOrdersCombined = [];
    this.customOrdersPacks = this.customOrderService.customItemsPacksOrdersDetails;
    this.customOrdersKG = this.customOrderService.customItemOrdersDetails;
    this.selectableOrders = this.customOrderService.selectableItemsOrders;
    this.selectedShopName = this.customOrderService.currentSelectedShopName;
    if (this.customOrderService.customItemOrdersDetails) {
      this.hasCustomOrders = true;
      this.allOrdersCombined = [
        ...this.allOrdersCombined,
        ...this.customOrderService.customItemOrdersDetails,
      ];
    }
    if (this.customOrderService.customItemsPacksOrdersDetails) {
      this.hasCustomOrders = true;
      this.allOrdersCombined = [
        ...this.allOrdersCombined,
        ...this.customOrderService.customItemsPacksOrdersDetails,
      ];
    }
    if (this.customOrderService.selectableItemsOrders) {
      const relevantSelectableOrders = this.customOrderService.selectableItemsOrders.filter(
        (element) => element.itemCount > 0
      );
      this.allOrdersCombined = [
        ...this.allOrdersCombined,
        ...relevantSelectableOrders,
      ];
    }
    const checkCustomItems = this.allOrdersCombined.find(
      (element) => element.orderType === "CUSTOM"
    );
    if (checkCustomItems) {
      this.hasCustomOrders = true;
    } else {
      this.hasCustomOrders = false;
    }
    if (this.selectableOrders) {
      // tslint:disable-next-line: only-arrow-functions
      this.grandTotal = this.selectableOrders.reduce(function (
        accumulator,
        item
      ) {
        return accumulator + item.totalPrice;
      },
      0);
    }
  }

  hourConverter(): number {
    const dateObj = new Date();
    const currentHour = dateObj.getHours() + 1;
    let twelveHourFormatDate = 0;
    if (currentHour <= 12) {
      twelveHourFormatDate = currentHour;
    } else {
      twelveHourFormatDate = currentHour - 12;
    }
    return twelveHourFormatDate;
  }

  amPmTracker(): string {
    const dateObj = new Date();
    const currentHour = dateObj.getHours() + 1;
    let amPmText = "";
    if (currentHour <= 12) {
      amPmText = "AM";
    } else {
      amPmText = "PM";
    }
    return amPmText;
  }

  monthConverter(monthNumber): string {
    let monthText = "";
    switch (monthNumber) {
      case 0:
        monthText = "Jan";
        break;
      case 1:
        monthText = "Feb";
        break;
      case 2:
        monthText = "Mar";
        break;
      case 3:
        monthText = "Apr";
        break;
      case 4:
        monthText = "May";
        break;
      case 5:
        monthText = "Jun";
        break;
      case 6:
        monthText = "Jul";
        break;
      case 7:
        monthText = "Aug";
        break;
      case 8:
        monthText = "Sep";
        break;
      case 9:
        monthText = "Oct";
        break;
      case 10:
        monthText = "Nov";
        break;
      case 11:
        monthText = "Dec";
        break;
    }
    return monthText;
  }

  async showLoginSignupScreen() {
    this.loginModalCtrl
      .create({
        component: LoginModalComponent,
        componentProps: {
          name: "loginModalComponent",
          navigationFrom: "CART",
        },
        id: "loginModal",
      })
      .then((loginModalEl) => {
        loginModalEl.present();
        return loginModalEl.onDidDismiss();
      })
      .then((data) => {
        if (data.role === "closed") {
          this.checkDeliveryAddress();
        } else if (data.role === "CART_UPDATE_FAILURE") {
          const header = "Oops... Something went wrong.";
          const message = "Please try again";
          this.orderPlacementFailureAlert(header, message);
        }
      });
  }

  async checkDeliveryAddress() {
    const customerSavedAddressList = await this.userProfileService.getCustomerSavedAddressListFromLocalStorage();
    if (customerSavedAddressList.length > 0) {
      this.deliveryAddress = customerSavedAddressList.find(
        (element) => element.isCurrentlyUsed === true
      );
      this.confirmDeliveryAddress();
    } else {
      this.addNewAddress();
    }
  }

  orderPlacementSuccessAlert() {}

  orderPlacementFailureAlert(header, message) {
    const alert = this.orderPlacementFailureCtrl
      .create({
        header,
        message,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: (cancel) => {},
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  otherOrderInProgressFailureAlert(header, message) {
    const alert = this.otherOrderInProgressFailureCtrl
      .create({
        header,
        message,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: (cancel) => {},
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  addNewAddress() {
    const alert = this.noAddressAlertCtrl
      .create({
        header: "Add a delivery address",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: (cancel) => {
              this.addNewAddressModalCtrl
                .create({
                  component: AddNewAddressModalComponent,
                  id: "addNewAddressModal",
                })
                .then((modalEl) => {
                  modalEl.present();
                  return modalEl.onDidDismiss();
                })
                .then((data) => {
                  this.orderDetails();
                });
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  confirmDeliveryAddress() {
    this.viewSavedAddressesModalCtrl
      .create({
        component: ViewSavedAddressesModalComponent,
        id: "viewSavedAddressesModal",
      })
      .then((viewSavedAddressModalEl) => {
        viewSavedAddressModalEl.present();
        return viewSavedAddressModalEl.onDidDismiss();
      })
      .then(async (data) => {
        this.orderDetails();
      });
  }

  async orderDetails() {
    const customerSavedAddressList = await this.userProfileService.getCustomerSavedAddressListFromLocalStorage();
    this.deliveryAddress = customerSavedAddressList.find(
      (element) => element.isCurrentlyUsed === true
    );
    this.isUserLoggedIn = true;
    if (
      this.customOrderService.customItemOrdersDetails &&
      this.customOrderService.customItemsPacksOrdersDetails
    ) {
      if (
        this.customOrderService.customItemOrdersDetails.length > 0 ||
        this.customOrderService.customItemsPacksOrdersDetails.length > 0
      ) {
        this.actionSheetCtrl
          .create({
            header: "Place Order",
            subHeader:
              // tslint:disable-next-line: max-line-length
              "You have custom orders in your cart. We will confirm the final price for the custom items once the items are picked. The Grand total shown is only for the selected items offered by the Shop. We will send you the final bill once the items are delivered.",
            buttons: [
              {
                text: "Ok. Got it. Place Order.",
                handler: () => {
                  this.confirmOrder();
                },
              },
            ],
          })
          .then((actionSheetEl) => {
            actionSheetEl.present();
          });
      } else {
        this.confirmOrder();
      }
    } else {
      this.confirmOrder();
    }
  }

  async placeOrder() {
    this.authStateSubs = this.authenticationService.userAuthState.subscribe(
      (userAuthState) => {
        if (!userAuthState || !userAuthState.value) {
          this.isUserLoggedIn = false;
          this.showLoginSignupScreen();
        } else {
          // this.orderDetails();
          this.checkDeliveryAddress();
        }
      }
    );
  }

  saveUserOrder(userFinalOrder): Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.userProfileService.saveUserOrder(userFinalOrder),
        this.userProfileService.addOrderToShopDB(userFinalOrder),
      ])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  confirmOrder() {
    this.placingOrderLoadingCtrl
      .create({
        message: "Placing your order ....",
      })
      .then((placingOrderEl) => {
        placingOrderEl.present();

        this.selectedShopDetails = this.customOrderService.selectedShopDetails;
        this.customOrderService.isResetAllOrdersNeeded = true;
        const randomInteger = Math.floor(Math.random() * 1299827);
        const date = new Date();
        this.userFinalOrder = {
          orderId: this.allOrdersCombined[0].shopId + "-" + randomInteger,
          shopId: this.allOrdersCombined[0].shopId,
          shopName: this.cartItemsShopName,
          orderedItemsList: this.allOrdersCombined,
          selectedItemsTotalPrice: this.grandTotal,
          customItemsEstimatedPrice: 0,
          estimatedDeliveryTime:
            this.deliveryTimeService.getManipulatedDeliveryTime()
              .deliveryTime1KTo2K + "mins",
          estimatedDeliveryDateTimeFull: this.deliveryDateTime,
          deliveryAddress: this.deliveryAddress,
          deliveryDate: date,
          deliveryTimeSlot: "within 30 minutes",
          deliveryCharge: "Free",
          maxDistance: 1 + " KM.",
          orderPlaced: true,
          orderStatus: "PROGRESS",
          orderConfirmationStatus: "CONFIRMED",
          paymentStatus: false,
        };

        this.userProfileService
          .saveUserOrder(this.userFinalOrder)
        // this.saveUserOrder(this.userFinalOrder)
          .then(async (customerCurrentOrder) => {
            // For Sending PUSH NOTIFICATION
            // UNCOMMENT WHEN PUSHING TO MOBILE
            // const shopMobileDetails = await this.commonUtilityService.getUserMobileDetails(
            //   this.cartItemsShopId
            // );
            // this.userProfileService.sendOrderConfPushNotificationToShop(
            //   shopMobileDetails.fcmToken
            // );
            this.shopItemSelectionService.removeUserSelectionFromLocalStorage();
            this.userProfileService
              .removeItemsFromCartPostOrderPlacement()
              .then((cartClearanceResponse) => {
                if (
                  cartClearanceResponse.message ===
                  "CART_ITEMS_CLEARED_POST_ORDER"
                ) {
                  placingOrderEl.dismiss();
                  this.orderConfModalCtrl
                    .create({
                      component: OrderConfirmedModalComponent,
                      componentProps: {
                        name: "orderConfModal",
                        orderId: this.userFinalOrder.orderId,
                      },
                      id: "orderConfModal",
                    })
                    .then((orderConfModalEl) => {
                      orderConfModalEl.present();
                      return orderConfModalEl.onDidDismiss();
                    })
                    .then((data) => {
                      this.isOrderUnplaced = false;
                      this.customOrderService.customItemsPacksOrdersDetails = [];
                      this.customOrderService.customItemOrdersDetails = [];
                      this.customOrderService.selectableItemsOrders = [];
                      this.selectableOrders = [];
                      this.messageService.sendCartStatusMessage("CART_EMPTY");
                    });
                }
              })
              .catch((e) => {
                alert("Internal catch Error: " + JSON.stringify(e));
                this.retryClearingDBCart();
              });
          })
          .catch((err) => {
            placingOrderEl.dismiss();
            if (err.error === "Error: OTHER_ORDER_IN_PROGRESS") {
              const header = `Order can't be placed.`;
              const message = `You have another order in progress. Please place order once this is delivered.`;
              this.otherOrderInProgressFailureAlert(header, message);
            } else {
              // Here We need to add code to revert the partial changes made to the DB
              // Firstly check which step failed
              // Retry doing it
              // If 2 retries failed, then throw Error Message and ask for again placing the order after sometime
              // alert("External catch Error: " + JSON.stringify(err));
              const header = "Oops... Something went wrong.";
              const message = "Please try again";
              this.orderPlacementFailureAlert(header, message);
            }
          });
      });
    // const orderConfPushushNotification = this.userProfileService.sendOrderConfPushNotification();
  }

  retryClearingDBCart() {
    this.userProfileService
      .removeItemsFromCartPostOrderPlacement()
      .then((dbClearanceRes) => {})
      .catch((err) => {});
  }
}
