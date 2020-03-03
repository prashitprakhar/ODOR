import { Component, OnInit } from "@angular/core";
import {
  NavParams,
  ModalController,
  LoadingController,
  AlertController
} from "@ionic/angular";
import { ICustomerAddress } from "src/app/models/customer-address.model";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { UserProfileService } from "src/app/services/user-profile.service";

@Component({
  selector: "app-edit-address-modal",
  templateUrl: "./edit-address-modal.component.html",
  styleUrls: ["./edit-address-modal.component.scss"]
})
export class EditAddressModalComponent implements OnInit {
  public address: ICustomerAddress;
  public editForm: FormGroup;
  public mobileNumberPattern = "^[0-9]*$";
  public updatedUserProfile;

  constructor(
    private navParams: NavParams,
    private editAddressModal: ModalController,
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private editProgressLoadingCtrl: LoadingController,
    private successAlertCtrl: AlertController,
    private failureAlertCtrl: AlertController
  ) {
    this.address = navParams.get("addressDetails");
  }

  ngOnInit() {
    this.editForm = new FormGroup({
      addressCategory: new FormControl(this.address.addressCategory, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      houseNumber: new FormControl(
        this.address.houseNumber,
        Validators.compose([
          Validators.maxLength(30),
          Validators.minLength(3),
          Validators.required
        ])
      ),
      addressLineOne: new FormControl(
        this.address.addressLineOne,
        Validators.compose([
          Validators.maxLength(50),
          Validators.minLength(5),
          Validators.required
        ])
      ),
      addressLineTwo: new FormControl(this.address.addressLineTwo),
      pincode: new FormControl(
        this.address.pincode,
        Validators.compose([
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern("^[0-9]*$"),
          Validators.required
        ])
      ),
      city: new FormControl(this.address.city, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      state: new FormControl(this.address.state, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      mobileNumber: new FormControl(
        this.address.mobileNumber,
        Validators.compose([
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern("^[0-9]*$"),
          Validators.required
        ])
      )
    });
  }

  // get houseNumber() { return this.editForm.get('houseNumber'); }
  // get addressLineOne() { return this.editForm.get('addressLineOne'); }
  // get pincode() { return this.editForm.get('pincode'); }
  // // get city() { return this.editForm.get('city'); }
  // // get state() { return this.editForm.get('state'); }
  // get mobileNumber() { return this.editForm.get('mobileNumber'); }

  onClose(status: string = null) {
    if (status === "SUCCESS") {
      this.editAddressModal.dismiss(
        this.updatedUserProfile,
        "closed",
        "editAddressDetailsModal"
      );
    } else {
      this.editAddressModal.dismiss(null, "closed", "editAddressDetailsModal");
    }
  }

  onSubmitAddressDetails() {
    this.editProgressLoadingCtrl
      .create({
        message: "Updating Address Details ..."
      })
      .then(loadingEl => {
        loadingEl.present();
        const addressCategory = this.editForm.get("addressCategory").value;
        const houseNumber = this.editForm.get("houseNumber").value;
        const addressLineOne = this.editForm.get("addressLineOne").value;
        const addressLineTwo = this.editForm.get("addressLineTwo").value;
        const pincode = this.editForm.get("pincode").value;
        const city = this.editForm.get("city").value;
        const state = this.editForm.get("state").value;
        const mobileNumber = this.editForm.get("mobileNumber").value;

        const customerAddressDetails: ICustomerAddress = {
          addressCategory,
          houseNumber,
          addressLineOne,
          addressLineTwo,
          pincode,
          city,
          state,
          mobileNumber,
          isCurrentlyUsed: this.address.isCurrentlyUsed,
          createdAt: this.address.createdAt
        };

        // console.log(
        //   "customerAddressDetails updated ******",
        //   customerAddressDetails
        // );
        this.userProfileService
          .editAddressDetails(customerAddressDetails, this.address["_id"])
          .then(updatedData => {
            this.updatedUserProfile = updatedData;
            loadingEl.dismiss();
            this.userProfileService.getAndSetCustomerProfile();
            this.editSuccessController();
          })
          .catch(e => {
            loadingEl.dismiss();
            this.editFailureController();
          });
      });
    // const addressCategory = this.editForm.get('addressCategory').value;
    // const houseNumber = this.editForm.get('houseNumber').value;
    // const addressLineOne = this.editForm.get('addressLineOne').value;
    // const addressLineTwo = this.editForm.get('addressLineTwo').value;
    // const pincode = this.editForm.get('pincode').value;
    // const city = this.editForm.get('city').value;
    // const state = this.editForm.get('state').value;
    // const mobileNumber = this.editForm.get('mobileNumber').value;

    // const customerAddressDetails: ICustomerAddress = {
    //   addressCategory,
    //   houseNumber,
    //   addressLineOne,
    //   addressLineTwo,
    //   pincode,
    //   city,
    //   state,
    //   mobileNumber,
    //   isCurrentlyUsed: this.address.isCurrentlyUsed,
    //   createdAt: this.address.createdAt
    // };

    // console.log("customerAddressDetails updated ******", customerAddressDetails);
    // this.userProfileService.editAddressDetails(customerAddressDetails, this.address["_id"])
    // .then(updatedData => {
    //   console.log("UPDATED ADDRESS DETAILS ********", updatedData);
    //   this.updatedUserProfile = updatedData;
    // })
    // .catch(e => {
    //   console.log("Error Occured while updating address details", e);
    // });
  }

  editSuccessController() {
    this.successAlertCtrl
      .create({
        header: "Successfully Updated Address.",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              this.editForm.reset();
              this.onClose("SUCCESS");
            }
          }
        ]
      })
      .then(successAlertEl => {
        successAlertEl.present();
      });
  }

  editFailureController() {
    this.failureAlertCtrl
      .create({
        header: "Oops... Something went wrong",
        message: "Please try again.",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {}
          }
        ]
      })
      .then(failureAlertEl => {
        failureAlertEl.present();
      });
  }
}
