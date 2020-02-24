import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ICustomerAddress } from 'src/app/models/customer-address.model';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-view-saved-addresses-modal',
  templateUrl: './view-saved-addresses-modal.component.html',
  styleUrls: ['./view-saved-addresses-modal.component.scss'],
})
export class ViewSavedAddressesModalComponent implements OnInit {

  public savedAddressesList: ICustomerAddress[] = [];

  constructor(private viewSavedAddressesModalCtrl: ModalController,
              private userProfileService: UserProfileService) { }

  ngOnInit() {
    this.userProfileService.getCustomerSavedAddresses()
    .then(addressList => {
      this.savedAddressesList = addressList.addressList;
      console.log(" addressList addressList ", addressList.addressList);
    })
    .catch(err => {
      console.log("No Address Found");
    })
  }

  onClose() {
    this.viewSavedAddressesModalCtrl.dismiss(null, "closed", "viewSavedAddressesModal");
  }

}
