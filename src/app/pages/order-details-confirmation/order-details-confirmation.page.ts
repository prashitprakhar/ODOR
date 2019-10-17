import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderConfirmedModalComponent } from 'src/app/modals/order-confirmed-modal/order-confirmed-modal.component';

@Component({
  selector: 'app-order-details-confirmation',
  templateUrl: './order-details-confirmation.page.html',
  styleUrls: ['./order-details-confirmation.page.scss'],
})
export class OrderDetailsConfirmationPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  onConfirmOrder() {
    this.modalCtrl.create({component: OrderConfirmedModalComponent})
      .then(modalEl => {
        modalEl.present();
      })
  }

}
