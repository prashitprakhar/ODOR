import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { OrderConfirmedModalComponent } from 'src/app/modals/order-confirmed-modal/order-confirmed-modal.component';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { IUserFinalOrder } from 'src/app/models/user-final-order.model';

@Component({
  selector: 'app-order-details-confirmation',
  templateUrl: './order-details-confirmation.page.html',
  styleUrls: ['./order-details-confirmation.page.scss'],
})
export class OrderDetailsConfirmationPage implements OnInit {

  public currentOrderDetails: IUserFinalOrder[] = [];

  constructor(private modalCtrl: ModalController,
              private activatedRoute: ActivatedRoute,
              private userProfileService: UserProfileService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("orderId")) {
        return;
      }
      console.log("Order ID ***",paramMap.get('orderId'))
      // console.log("paramMap order Id",paramMap)
      this.currentOrderDetails  = this.userProfileService.getUserOrder();
      // console.log("Order Details final ************",this.currentOrderDetails)
      // this.shopId = paramMap.get("shopId");
      // this.selectedShopDetails = this.shopItemSelectionService.getShopOfferedItems(
      //   this.shopId
      // );
      // this.customOrderService.selectedShopDetails = this.selectedShopDetails;
      
      // this.shopOfferedItemsList = this.selectedShopDetails.shopOfferedItemsList;
    });
  }

  // onConfirmOrder() {
  //   this.modalCtrl.create({component: OrderConfirmedModalComponent})
  //     .then(modalEl => {
  //       modalEl.present();
  //     })
  // }

}
