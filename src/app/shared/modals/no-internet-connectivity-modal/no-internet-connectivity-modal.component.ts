import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-internet-connectivity-modal',
  templateUrl: './no-internet-connectivity-modal.component.html',
  styleUrls: ['./no-internet-connectivity-modal.component.scss'],
})
export class NoInternetConnectivityModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  onClose() {
    // this.editItemDetailsModalCtrl.dismiss(null, "closed", "editItemDetailsModal");
  }

}
