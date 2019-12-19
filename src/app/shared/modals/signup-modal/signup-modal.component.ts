import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  AlertController,
  LoadingController,
  ModalController
} from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup-modal",
  templateUrl: "./signup-modal.component.html",
  styleUrls: ["./signup-modal.component.scss"]
})
export class SignupModalComponent implements OnInit {
  private API_KEY = "AIzaSyAL4mqXZ-hE9qr1winLtaeGO9kW2BfiVKQ";

  constructor(
    private signupModalCtrl: ModalController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onClose() {
    this.signupModalCtrl.dismiss(null, "ALL_READY_MEMBER", "signupModal");
  }

  onSignup(signupForm: NgForm) {
    if (!signupForm.valid) {
      return;
    }
    const email = signupForm.value.email;
    const password = signupForm.value.password;
    // const confirmPasword = signupForm.value.confirmPasword;

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Creating Your Account..." })
      .then(signupEl => {
        signupEl.present();
        this.authService.signup(email, password).subscribe(
          resData => {
            signupEl.dismiss();
            this.signupModalCtrl.dismiss(null, "closed", "signupModal");
          },
          errRes => {
            signupEl.dismiss();
            const errorCode = errRes.error.error.message;
            let errorMessage = "";
            let headerLabel = "";
            if (errorCode === "EMAIL_EXISTS") {
              errorMessage =
                "Do you want to create account with a different email ?";
              headerLabel = "Email already exists.";
              this.emailAlreadyExistsAlertMessage(
                headerLabel,
                errorMessage,
                signupForm
              );
            } else {
              errorMessage = "Something went wrong. Please try again.";
              headerLabel = "OOPS...";
              this.genericErrorAlertMessage(
                headerLabel,
                errorMessage,
                signupForm
              );
            }
          }
        );
      });
  }

  genericErrorAlertMessage(headerLabel, errorMessage, signupForm: NgForm) {
    this.alertCtrl
      .create({
        header: headerLabel,
        message: errorMessage,
        buttons: [
          {
            text: "OK",
            handler: () => {}
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  emailAlreadyExistsAlertMessage(
    headerLabel,
    errorMessage,
    signupForm: NgForm
  ) {
    this.alertCtrl
      .create({
        header: headerLabel,
        message: errorMessage,
        buttons: [
          {
            text: "No",
            role: "cancel",
            cssClass: "secondary",
            handler: cancel => {
              this.signupModalCtrl.dismiss(null, "ALL_READY_MEMBER", "signupModal");
            }
          },
          {
            text: "Yes",
            handler: () => {
              signupForm.reset();
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }
}
