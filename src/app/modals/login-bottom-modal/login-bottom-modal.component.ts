import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login-bottom-modal',
  templateUrl: './login-bottom-modal.component.html',
  styleUrls: ['./login-bottom-modal.component.scss'],
})
export class LoginBottomModalComponent implements OnInit {

  constructor(private halfLoginModalCtrl: ModalController) { }

  ngOnInit() {}

  onClose() {
    this.halfLoginModalCtrl.dismiss(null, 'closed', 'loginBottomModal');
  }

}
