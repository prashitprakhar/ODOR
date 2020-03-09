import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
// import { AuthService } from 'src/app/services/auth.service';
// import { Router } from '@angular/router';
import {
  LoadingController,
  ModalController,
  AlertController,
  ToastController,
  NavParams
} from "@ionic/angular";
// import { UserProfileService } from 'src/app/services/user-profile.service';
import { Plugins } from "@capacitor/core";
import { Observable, Subscription } from "rxjs";
import { SignupModalComponent } from "../signup-modal/signup-modal.component";
import { SignupSuccessModalComponent } from "../signup-success-modal/signup-success-modal.component";
import { AuthenticationService } from "../../internal-services/authentication.service";
import { PasswordResetModalComponent } from "../password-reset-modal/password-reset-modal.component";
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: "app-login-modal",
  templateUrl: "./login-modal.component.html",
  styleUrls: ["./login-modal.component.scss"]
})
export class LoginModalComponent implements OnInit, OnDestroy {
  public authObjObservable: Observable<any>;
  public authObjObsSubs: Subscription;
  public navigationFrom: string;

  constructor(
    private loadingCtrl: LoadingController,
    private signupModalCtrl: ModalController,
    private alertCtrl: AlertController,
    private signupSuccessModalCtrl: ModalController,
    private loginSuccessToastCtrl: ToastController,
    private loginModalCtrl: ModalController,
    private authenticationService: AuthenticationService,
    private passwordResetModalCtrl: ModalController,
    private navParams: NavParams,
    private userProfileService: UserProfileService
  ) {
    this.navigationFrom = navParams.get("navigationFrom");
  }

  ngOnInit() {}

  onClose() {
    this.loginModalCtrl.dismiss(null, "closed", "loginModal");
  }

  onCloseLoginSuccess(userRole) {
    this.loginModalCtrl.dismiss(userRole, "LOGIN_SUCCESS", "loginModal");
  }

  ngOnDestroy() {
    if (this.authObjObsSubs) {
      this.authObjObsSubs.unsubscribe();
    }
  }

  setUserProfileData() {
    this.userProfileService.getAndSetCustomerProfile();
  }

  async onLogin(loginForm: NgForm) {
    if (!loginForm.valid) {
      return;
    }
    const email = loginForm.value.email;
    const password = loginForm.value.password;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Logging in..." })
      .then(async loadingEl => {
        loadingEl.present();
        this.authObjObservable = this.authenticationService.login(
          email,
          password
        );
        this.authObjObsSubs = this.authObjObservable.subscribe(
          async loginResData => {
            const userAuthInfo = loginResData["user"];
            const userRole = userAuthInfo["role"];
            await loadingEl.dismiss();
            console.log("this.navigationFrom<<<<<>>>>>>", this.navigationFrom);
            if (this.navigationFrom && this.navigationFrom === "CART") {
              this.setUserProfileData();
              this.onClose();
            }
            if (userRole === "ENTERPRISE_PARTNER") {
              this.loginSuccessToastControllerMessage();
              this.onCloseLoginSuccess("ENTERPRISE_PARTNER");
            } else if (userRole === "GENERAL_ADMIN") {
              this.loginSuccessToastControllerMessage();
              this.onCloseLoginSuccess("GENERAL_ADMIN");
            } else {
              await this.authObjObsSubs.unsubscribe();
              this.setUserProfileData();
              this.loginSuccessToastControllerMessage();
              this.onCloseLoginSuccess("CUSTOMER");
            }
          },
          errorFetchingUserProfile => {
            loadingEl.dismiss();
            let errorMessage = "";
            let errorHeader = "";
            errorMessage = "Something went wrong. Please try again.";
            errorHeader = "OOPS...";
            this.genericErrorAlertMessage(errorHeader, errorMessage, loginForm);
          }
        );
        loginForm.reset();
      });
  }

  async loginSuccessToastControllerMessage() {
    const authData = Plugins.Storage.get({ key: "authData" });
    authData.then(async data => {
      const loginDetails = JSON.parse(data.value);
      const loginSuccessToast = await this.loginSuccessToastCtrl.create({
        message: `Successfully logged in as ${loginDetails.email}`,
        duration: 1500,
        position: "bottom",
        color: "success"
      });
      loginSuccessToast.present();
    });
  }

  emailNotFoundErrorAlertMessage(headerLabel, errorMessage, loginForm: NgForm) {
    this.alertCtrl
      .create({
        header: headerLabel,
        message: errorMessage,
        buttons: [
          {
            text: "OK",
            handler: () => {
              loginForm.reset();
              this.signup();
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  genericErrorAlertMessage(headerLabel, errorMessage, loginForm: NgForm) {
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

  incorrectPasswordErrorAlertMessage(
    headerLabel,
    errorMessage,
    loginForm: NgForm
  ) {
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

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
  }

  signupSuccess() {
    // this.signupSuccessModalCtrl
    //   .create({
    //     component: SignupSuccessModalComponent,
    //     id: "signupSuccessModal"
    //   })
    //   .then(signupSuccessModalEl => {
    //     signupSuccessModalEl.present();
    //     return signupSuccessModalEl.onDidDismiss();
    //   });
  }

  signup() {
    this.signupModalCtrl
      .create({
        component: SignupModalComponent,
        id: "signupModal"
      })
      .then(signupModalEl => {
        signupModalEl.present();
        return signupModalEl.onDidDismiss();
      })
      .then(data => {
        if (data.role !== "ALL_READY_MEMBER") {
          this.signupSuccessModalCtrl
            .create({
              component: SignupSuccessModalComponent,
              id: "signupSuccessModal"
            })
            .then(signupSuccessModalEl => {
              signupSuccessModalEl.present();
              return signupSuccessModalEl.onDidDismiss();
            });
        }
      });
  }

  passwordReset() {
    this.passwordResetModalCtrl
      .create({
        component: PasswordResetModalComponent,
        id: "passwordResetModal"
      })
      .then(passwordResetModalEl => {
        passwordResetModalEl.present();
        return passwordResetModalEl.onDidDismiss();
      })
      .then(data => {});
  }
}
