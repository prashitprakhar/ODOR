import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NavParams } from "@ionic/angular";
import { IShopOfferedItems } from 'src/app/models/shop-offered-items.model';
import { FormsModule, ReactiveFormsModule, NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ShopItemSelectionService } from 'src/app/services/shop-item-selection.service';

@Component({
  selector: 'app-edit-item-details-modal',
  templateUrl: './edit-item-details-modal.component.html',
  styleUrls: ['./edit-item-details-modal.component.scss'],
})
export class EditItemDetailsModalComponent implements OnInit {

  public product: IShopOfferedItems;
  public editForm: FormGroup;

  constructor(private editItemDetailsModalCtrl: ModalController,
              private navParams: NavParams,
              private shopItemSelectionService: ShopItemSelectionService,
              private updatingItemLoadingCtrl: LoadingController) {
    this.product = navParams.get("product");
    // console.log("this.product*****",this.product);
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      itemName: new FormControl(this.product.itemName, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      itemBrand: new FormControl(this.product.itemBrand, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      itemCategory: new FormControl(this.product.itemCategory, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      itemUndiscountedRate: new FormControl(this.product.itemUndiscountedRate, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      discountPercentage: new FormControl(this.product.discountAmount, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      itemWeight: new FormControl(this.product.itemWeight, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      })
    });
  }

  onClose() {
    this.editItemDetailsModalCtrl.dismiss(null, "closed", "editItemDetailsModal");
  }

  onSubmitItemDetails() {
    const itemUndiscountedRate = this.editForm.value.itemUndiscountedRate;
    const discountPercentage = this.editForm.value.discountPercentage;
    const updateItemDetails = {
      itemId: this.product.itemId,
          itemName: this.editForm.value.itemName,
          itemBrand: this.editForm.value.itemBrand,
          itemDescription: this.product.itemDescription,
          itemCategory: this.editForm.value.itemCategory,
          itemUndiscountedRate,
          itemWeight: this.editForm.value.itemWeight,
          itemUnit: this.product.itemUnit,
          isDiscountedAvailable: parseFloat(discountPercentage) > 0 ? true : false,
          itemDiscountedRate: itemUndiscountedRate - parseFloat(discountPercentage) * itemUndiscountedRate / 100,
          discountAmount: 0,
          // tslint:disable-next-line: radix
          discountPercentage : parseInt(discountPercentage),
          itemCount: 0,
          itemAvailable: true,
          itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
    };
    this.updatingItemLoadingCtrl.create({
      message: 'Updating Item Details ...'
    }).then(loadingEl => {
      loadingEl.present();
      this.shopItemSelectionService.updateItemDetails(updateItemDetails).subscribe(data => {
        loadingEl.dismiss();
        this.editForm.reset();
        this.editItemDetailsModalCtrl.dismiss(null, "closed", "editItemDetailsModal");
      });
    });
  }

}
