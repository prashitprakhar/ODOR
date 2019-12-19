import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-signup-success-modal',
  templateUrl: './signup-success-modal.component.html',
  styleUrls: ['./signup-success-modal.component.scss'],
})
export class SignupSuccessModalComponent implements OnInit {

  constructor(private signupSuccessModal: ModalController) { }

  ngOnInit() {}

  onClose() {
    this.signupSuccessModal.dismiss(null, "closed", "signupSuccessModal");
  }
}
