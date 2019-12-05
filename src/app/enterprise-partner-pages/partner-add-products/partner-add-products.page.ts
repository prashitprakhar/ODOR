import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { IShopOfferedItems } from 'src/app/models/shop-offered-items.model';
import { ShopItemSelectionService } from 'src/app/services/shop-item-selection.service';

@Component({
  selector: 'app-partner-add-products',
  templateUrl: './partner-add-products.page.html',
  styleUrls: ['./partner-add-products.page.scss'],
})
export class PartnerAddProductsPage implements OnInit {

  public newItem: IShopOfferedItems;

  constructor(private shopItemSelectionService: ShopItemSelectionService,
              private router: Router, private failureAlertCtrl: AlertController,
              private addingItemLoadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onSubmitItemDetails(itemDetailsForm: NgForm) {
    if (!itemDetailsForm.valid) {
      return;
    }
    this.addingItemLoadingCtrl.create({
      message: 'Adding New Item ...'
    }).then(loadingEl => {
      loadingEl.present();
      const itemName = itemDetailsForm.value.itemName;
      const itemBrand = itemDetailsForm.value.itemBrand;
      const itemCategory = itemDetailsForm.value.itemCategory;
      const itemUndiscountedRate = itemDetailsForm.value.itemUndiscountedRate;
      const discountPercentage = itemDetailsForm.value.discountPercentage;
      const itemWeight = itemDetailsForm.value.itemWeight;

      this.newItem = {
      itemId: Math.random().toString(),
          itemName,
          itemBrand,
          itemDescription: 'No Description',
          itemCategory,
          itemUndiscountedRate,
          itemWeight,
          itemUnit: 'g',
          isDiscountedAvailable: parseFloat(discountPercentage) > 0 ? true : false,
          itemDiscountedRate: itemUndiscountedRate - parseFloat(discountPercentage) * itemUndiscountedRate / 100,
          discountAmount: 0,
          // tslint:disable-next-line: radix
          discountPercentage : parseInt(discountPercentage),
          itemCount: 0,
          itemAvailable: true,
          itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
    };

      this.shopItemSelectionService.addNewItem(this.newItem).subscribe(() => {
        loadingEl.dismiss();
        itemDetailsForm.reset();
        this.router.navigate(['/partnerHomePage/partnerTabs']) ;
    });
    });
    // const itemName = itemDetailsForm.value.itemName;
    // const itemBrand = itemDetailsForm.value.itemBrand;
    // const itemCategory = itemDetailsForm.value.itemCategory;
    // const itemUndiscountedRate = itemDetailsForm.value.itemUndiscountedRate;
    // const discountPercentage = itemDetailsForm.value.discountPercentage;
    // const itemWeight = itemDetailsForm.value.itemWeight;

    // this.newItem = {
    //   itemId: Math.random().toString(),
    //       itemName,
    //       itemBrand,
    //       itemDescription: 'No Description',
    //       itemCategory,
    //       itemUndiscountedRate,
    //       itemWeight,
    //       itemUnit: 'g',
    //       isDiscountedAvailable: parseFloat(discountPercentage) > 0 ? true : false,
    //       itemDiscountedRate: itemUndiscountedRate - parseFloat(discountPercentage) * itemUndiscountedRate / 100,
    //       discountAmount: 0,
    //       // tslint:disable-next-line: radix
    //       discountPercentage : parseInt(discountPercentage),
    //       itemCount: 0,
    //       itemAvailable: true,
    //       itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
    // };

    // this.shopItemSelectionService.addNewItem(this.newItem).subscribe(() => {
    //   itemDetailsForm.reset();
    //   this.router.navigate(['/partnerHomePage/partnerTabs']) ;
    // });
    // itemDetailsForm.reset();
    //   this.router.navigate(['/partnerHomePage/partnerTabs']) ;

    // this.failureAlertCtrl
    //       .create({
    //         header: "Something went Wrong",
    //         message:
    //           "Item couldn't be added. Please try again.",
    //         buttons: [
    //           // {
    //           //   text: "No",
    //           //   role: "cancel",
    //           //   cssClass: "secondary",
    //           //   handler: cancel => {
    //           //     // console.log("cancel ***");
    //           //     this.modalCtrl.dismiss(null, "closed", "customItemModal");
    //           //   }
    //           // },
    //           {
    //             text: "OK",
    //             handler: () => {
    //               // this.customOrderService.customItemOrdersDetails = [];
    //               // this.customOrderService.customItemsPacksOrdersDetails = [];
    //               // this.customOrderService.selectableItemsOrders = [];
    //               // this.customOrderService.isResetAllOrdersNeeded = true;
    //             }
    //           }
    //         ]
    //       })
    //       .then(alertEl => {
    //         alertEl.present();
    //       });
  }

  /*
itemId: 'MILK1',
          itemName: 'Mother Dairy Milk',
          itemBrand: 'Mother Dairy',
          itemDescription: 'Packaged Milk Tetra Pack',
          itemCategory: 'Packaged',
          itemUndiscountedRate: 10,
          itemWeight: 100,
          itemUnit: 'g',
          isDiscountedAvailable: false,
          itemDiscountedRate: 10,
          discountAmount: 0,
          discountPercentage: 0,
          itemCount: 0,
          itemAvailable: true,
          itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'

  */

    /*
    itemId: string;
    itemName: string;
    itemBrand: string;
    itemDescription: string;
    itemCategory: string; // Loose locally packed/Packaged
    itemUndiscountedRate: number;
    isDiscountedAvailable: boolean;
    itemDiscountedRate: number;
    discountAmount: number;
    discountPercentage: number;
    itemImageUrl: string;
    itemWeight: number;
    itemCount: number;
    itemUnit: string;
    itemAvailable: boolean;
  */

}
