import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
// import { Plugins } from "@capacitor/core";
// import { AuthService } from "src/app/services/auth.service";
import { AuthenticationService } from "src/app/shared/internal-services/authentication.service";
import { AdminShopFunctionsService } from "src/app/admin/services/admin-shop-functions.service";

@Component({
  selector: "app-partner-add-products",
  templateUrl: "./partner-add-products.page.html",
  styleUrls: ["./partner-add-products.page.scss"]
})
export class PartnerAddProductsPage implements OnInit {
  public newItem: IShopOfferedItems;
  public userId: string;

  constructor(
    private shopItemSelectionService: ShopItemSelectionService,
    private router: Router,
    private failureAlertCtrl: AlertController,
    private successAlertCtrl: AlertController,
    private addingItemLoadingCtrl: LoadingController,
    private authenticationService: AuthenticationService,
    private adminShopFunctionsService: AdminShopFunctionsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authenticationService.userId.subscribe(userId => {
      this.userId = userId;
    });
  }

  onSubmitItemDetails(itemDetailsForm: NgForm) {
    if (!itemDetailsForm.valid) {
      return;
    }
    this.addingItemLoadingCtrl
      .create({
        message: "Adding New Item ..."
      })
      .then(loadingEl => {
        loadingEl.present();
        const itemName = itemDetailsForm.value.itemName;
        const itemBrand = itemDetailsForm.value.itemBrand;
        const itemCategory = itemDetailsForm.value.itemCategory;
        const itemUndiscountedRate = parseFloat(itemDetailsForm.value.itemUndiscountedRate);
        const discountPercentage = itemDetailsForm.value.discountPercentage;
        const itemWeight = itemDetailsForm.value.itemWeight;

        this.newItem = {
          _id: Math.random().toString(),
          // itemId: Math.random().toString(),
          itemName,
          itemBrand,
          itemDescription: "No Description",
          itemCategory,
          itemUndiscountedRate,
          itemWeight,
          itemUnit: "g",
          isDiscountedAvailable:
            parseFloat(discountPercentage) > 0 ? true : false,
          itemDiscountedRate:
            // tslint:disable-next-line: radix
            parseInt((itemUndiscountedRate -
            (parseFloat(discountPercentage) * itemUndiscountedRate) / 100).toFixed(0)),
          discountAmount: 0,
          // tslint:disable-next-line: radix
          discountPercentage: parseInt(discountPercentage),
          itemCount: 0,
          itemAvailable: true,
          itemImageUrl:
            "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
        };

        const newItemForAdding = {
          itemName,
          itemBrand,
          itemDescription: "No Description",
          itemCategory,
          itemUndiscountedRate,
          itemWeight,
          itemUnit: "g",
          isDiscountedAvailable:
            parseFloat(discountPercentage) > 0 ? true : false,
          itemDiscountedRate:
            // tslint:disable-next-line: radix
            parseInt((itemUndiscountedRate -
            (parseFloat(discountPercentage) * itemUndiscountedRate) / 100).toFixed(0)),
          discountAmount: 0,
          // tslint:disable-next-line: radix
          discountPercentage: parseInt(discountPercentage),
          itemCount: 0,
          itemAvailable: true,
          itemImageUrl:
            "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
        };

        this.shopItemSelectionService
          .addShopOfferedNewItem(newItemForAdding)
          .then(ShopItemsList => {
            loadingEl.dismiss();
            const header = "Successful";
            const message = "Item added successfully.";
            this.successAlertMessage(header, message, itemDetailsForm);
          })
          .catch(err => {
            loadingEl.dismiss();
            const header = "Error Occured";
            const message = "Item couldn't be added. Please try again.";
            this.failureAlertMessage(header, message);
          });
      });
  }

  successAlertMessage(header, message, itemDetailsForm: NgForm) {
    this.successAlertCtrl
      .create({
        header,
        message,
        buttons: [
          {
            text: "Add Another Item",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              itemDetailsForm.reset();
            }
          },
          {
            text: "OK",
            handler: () => {
              itemDetailsForm.reset();
              this.router.navigateByUrl(
                "/partnerHomePage/partnerTabs/partnerMyShop"
              );
            }
          }
        ]
      })
      .then(alertSuccessEl => {
        alertSuccessEl.present();
      });
  }

  failureAlertMessage(header, message) {
    this.failureAlertCtrl
      .create({
        header,
        message,
        buttons: [
          {
            text: "OK",
            handler: () => {
            }
          }
        ]
      })
      .then(alertFailureEl => {
        alertFailureEl.present();
      });
  }
}
