import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  LoadingController,
  AlertController
} from "@ionic/angular";
import { NavParams } from "@ionic/angular";
import { IShopOfferedItems } from "src/app/models/shop-offered-items.model";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { ShopItemSelectionService } from "src/app/services/shop-item-selection.service";
// FormsModule, ReactiveFormsModule, NgForm,
@Component({
  selector: "app-edit-item-details-modal",
  templateUrl: "./edit-item-details-modal.component.html",
  styleUrls: ["./edit-item-details-modal.component.scss"]
})
export class EditItemDetailsModalComponent implements OnInit {
  public product: IShopOfferedItems;
  public editForm: FormGroup;
  public shopId: string;

  constructor(
    private editItemDetailsModalCtrl: ModalController,
    private navParams: NavParams,
    private shopItemSelectionService: ShopItemSelectionService,
    private updatingItemLoadingCtrl: LoadingController,
    private failureEditAlertCtrl: AlertController,
    private successAlertCtrl: AlertController
  ) {
    this.product = navParams.get("product");
    this.shopId = navParams.get("selectedShopId");
    // console.log("this.product*****",this.product);
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      itemName: new FormControl(this.product.itemName, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      itemBrand: new FormControl(this.product.itemBrand, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      itemCategory: new FormControl(this.product.itemCategory, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      itemUndiscountedRate: new FormControl(this.product.itemUndiscountedRate, {
        updateOn: "blur",
        validators: [Validators.required, Validators.min(1)]
      }),
      discountPercentage: new FormControl(this.product.discountAmount, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      itemWeight: new FormControl(this.product.itemWeight, {
        updateOn: "blur",
        validators: [Validators.required, Validators.min(1)]
      })
    });
  }

  onClose() {
    this.editItemDetailsModalCtrl.dismiss(
      null,
      "closed",
      "editItemDetailsModal"
    );
  }

  onSubmitItemDetails() {
    const itemUndiscountedRate = this.editForm.value.itemUndiscountedRate;
    const discountPercentage = this.editForm.value.discountPercentage;
    const updateItemDetails: IShopOfferedItems = {
      _id: this.product._id,
      itemId: this.product._id,
      itemName: this.editForm.value.itemName,
      itemBrand: this.editForm.value.itemBrand,
      itemDescription: this.product.itemDescription,
      itemCategory: this.editForm.value.itemCategory,
      itemUndiscountedRate,
      itemWeight: this.editForm.value.itemWeight,
      itemUnit: this.product.itemUnit,
      isDiscountedAvailable: parseFloat(discountPercentage) > 0 ? true : false,
      itemDiscountedRate:
        itemUndiscountedRate -
        (parseFloat(discountPercentage) * itemUndiscountedRate) / 100,
      discountAmount: 0,
      // tslint:disable-next-line: radix
      discountPercentage: parseInt(discountPercentage),
      itemCount: 0,
      itemAvailable: true,
      itemImageUrl:
        "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
    };
    this.updatingItemLoadingCtrl
      .create({
        message: "Updating Item Details ..."
      })
      .then(loadingEl => {
        loadingEl.present();
        //     this.shopItemSelectionService.getProductDoc('ENTERPRISE_PARTNER_PRODUCTS', this.shopId.toString())
        //   .subscribe(newItemAdd => {
        //     const docId = newItemAdd.map(data => data.payload.doc.id);
        //     const doc = newItemAdd.map(element => element.payload.doc.data());
        //     const shopOfferedItems = doc[0]["shopOfferedItems"].filter(element => element.itemId !== this.product.itemId);
        //     doc[0]["shopOfferedItems"] = shopOfferedItems;
        //     doc[0]["shopOfferedItems"].push(updateItemDetails)
        //     this.shopItemSelectionService.updateDocument('ENTERPRISE_PARTNER_PRODUCTS', doc[0], docId[0])
        //     .subscribe(updatedDoc => {
        //       loadingEl.dismiss();
        //       this.editForm.reset();
        //       this.editItemDetailsModalCtrl.dismiss(null, "closed", "editItemDetailsModal");
        //     }, error => {
        //       console.log("Error Occured While Deleting Item");
        //     });
        // });
        this.shopItemSelectionService
          .updateItemDetails(this.shopId.toString(), updateItemDetails)
          .then(async updatedData => {
            console.log("updatedData updatedData *****", updatedData);
            loadingEl.dismiss();

            const header = "Update Successful";
            const message = "Item details have been updated Successfully";
            this.updateSuccess(header, message);
            // this.editForm.reset();
            // this.editItemDetailsModalCtrl.dismiss(
            //   null,
            //   "closed",
            //   "editItemDetailsModal"
            // );
          })
          .catch(err => {
            loadingEl.dismiss();
            const header = "Item Edit Failed";
            const message = "Please try again.";
            this.updateFailure(header, message);
            console.log("Update Error *********", err);
          });
        // this.shopItemSelectionService
        //   .getProductDoc("ENTERPRISE_PARTNER_PRODUCTS", this.shopId.toString())
        //   .subscribe(newItemAdd => {
        //     const docId = newItemAdd.map(data => data.payload.doc.id);
        //     const doc = newItemAdd.map(element => element.payload.doc.data());
        //     const shopOfferedItems = doc[0]["shopOfferedItems"].filter(
        //       element => element.itemId !== this.product.itemId
        //     );
        //     doc[0]["shopOfferedItems"] = shopOfferedItems;
        //     doc[0]["shopOfferedItems"].push(updateItemDetails);
        //     this.shopItemSelectionService
        //       .updateDocument("ENTERPRISE_PARTNER_PRODUCTS", doc[0], docId[0])
        //       .subscribe(
        //         updatedDoc => {
        //           loadingEl.dismiss();
        //           this.editForm.reset();
        //           this.editItemDetailsModalCtrl.dismiss(
        //             null,
        //             "closed",
        //             "editItemDetailsModal"
        //           );
        //         },
        //         error => {
        //           console.log("Error Occured While Deleting Item");
        //         }
        //       );
        //   });
        // this.shopItemSelectionService.updateItemDetails(updateItemDetails).subscribe(data => {
        //   loadingEl.dismiss();
        //   this.editForm.reset();
        //   this.editItemDetailsModalCtrl.dismiss(null, "closed", "editItemDetailsModal");
        // });
      });
  }

  updateFailure(header, message) {
    const alert = this.failureEditAlertCtrl
      .create({
        header,
        message,
        //   "Please ",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              // console.log("Shop is closed");
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  updateSuccess(header, message) {
    const alert = this.successAlertCtrl
      .create({
        header,
        message,
        //   "Please ",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              this.editForm.reset();
              this.editItemDetailsModalCtrl.dismiss(
                null,
                "closed",
                "editItemDetailsModal"
              );
              // console.log("Shop is closed");
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }
}
