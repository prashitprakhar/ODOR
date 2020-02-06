import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
// import { AuthService } from 'src/app/services/auth.service';
// import { Router } from '@angular/router';
import { LoadingController, ModalController, AlertController, ToastController } from '@ionic/angular';
// import { UserProfileService } from 'src/app/services/user-profile.service';
import { Plugins } from "@capacitor/core";
import { Observable, Subscription } from "rxjs";
import { SignupModalComponent } from '../signup-modal/signup-modal.component';
import { SignupSuccessModalComponent } from '../signup-success-modal/signup-success-modal.component';
import { AuthenticationService } from '../../internal-services/authentication.service';
import { PasswordResetModalComponent } from '../password-reset-modal/password-reset-modal.component';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit, OnDestroy {

  public authObjObservable: Observable<any>;
  public authObjObsSubs: Subscription;

  constructor(// private authService: AuthService,
              // private router: Router,
              private loadingCtrl: LoadingController,
              private signupModalCtrl: ModalController,
              private alertCtrl: AlertController,
              private signupSuccessModalCtrl: ModalController,
              private loginSuccessToastCtrl: ToastController,
              // private userProfileService: UserProfileService,
              private loginModalCtrl: ModalController,
              private authenticationService: AuthenticationService,
              private passwordResetModalCtrl: ModalController) { }

  ngOnInit() {
    console.log("Opened Login/Signup Modal");
  }

  onClose() {
      this.loginModalCtrl.dismiss(null, "closed", "loginModal");
  }

  onCloseLoginSuccess(userRole) {
    // console.log("Called on close");
    // const data = {
    //   role: userRole,

    // }
    this.loginModalCtrl.dismiss(userRole, "LOGIN_SUCCESS", "loginModal");
  }

  ngOnDestroy() {
    if (this.authObjObsSubs) {
      this.authObjObsSubs.unsubscribe();
    }
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
        this.authObjObservable = this.authenticationService.login(email, password);
        this.authObjObsSubs = this.authObjObservable.subscribe(async loginResData => {
          const userAuthInfo = loginResData["user"];
          const userRole = userAuthInfo["role"];
          await loadingEl.dismiss();
          if (userRole === "ENTERPRISE_PARTNER") {
            this.loginSuccessToastControllerMessage();
            this.onCloseLoginSuccess('ENTERPRISE_PARTNER');
          } else if (userRole === "GENERAL_ADMIN") {
            this.loginSuccessToastControllerMessage();
            this.onCloseLoginSuccess('GENERAL_ADMIN');
          } else {
            await this.authObjObsSubs.unsubscribe();
            this.loginSuccessToastControllerMessage();
            this.onCloseLoginSuccess('CUSTOMER');
          }
        }, errorFetchingUserProfile => {
          loadingEl.dismiss();
          let errorMessage = "";
          let errorHeader = "";
          errorMessage = "Something went wrong. Please try again.";
          errorHeader = "OOPS...";
          this.genericErrorAlertMessage(
            errorHeader,
            errorMessage,
            loginForm
          );
        });
        // this.authObjObsSubs = this.authObjObservable.subscribe(
        //   async resData => {
        //     const loginData = resData.user.toJSON();
        //     this.userProfileService.getUserProfile(loginData.email).subscribe(async userProfile => {
        //       // mahalakshmikiranastore@gmail.com
        //       // Qwerty123!
        //       const userRole = userProfile[0]["role"];
        //       await loadingEl.dismiss();
        //       if (userRole === "ENTERPRISE_PARTNER") {
        //       this.loginSuccessToastControllerMessage();
        //       // this.router.navigateByUrl("/partnerHomePage/partnerTabs");
        //       this.onCloseLoginSuccess('ENTERPRISE_PARTNER');
        //     } else if (userRole === "GENERAL_ADMIN") {
        //       this.loginSuccessToastControllerMessage();
        //       this.onCloseLoginSuccess('GENERAL_ADMIN');
        //       // this.router.navigateByUrl("/adminHomePage/adminTab");
        //     // } else if (userRole === "CUSTOMER") {
        //     } else {
        //       await this.authObjObsSubs.unsubscribe();
        //       this.loginSuccessToastControllerMessage();
        //       // this.router.navigateByUrl("/homepage/tabs");
        //       this.onCloseLoginSuccess('CUSTOMER');
        //       // this.router.navigateByUrl("/homepage/tabs/account");
        //     }
        //     }, errorFetchingUserProfile => {
        //       loadingEl.dismiss();
        //       let errorMessage = "";
        //       let errorHeader = "";
        //       errorMessage = "Something went wrong. Please try again.";
        //       errorHeader = "OOPS...";
        //       this.genericErrorAlertMessage(
        //         errorHeader,
        //         errorMessage,
        //         loginForm
        //       );
        //     });
        //     // await loadingEl.dismiss();
        //     // if (loginData.email === "mahalakshmikiranastore@gmail.com") {
        //     //   // Qwerty123!
        //     //   this.loginSuccessToastControllerMessage();
        //     //   this.router.navigateByUrl("/partnerHomePage/partnerTabs");
        //     // } else if (loginData.email === "orderitservice@gmail.com") {
        //     //   this.loginSuccessToastControllerMessage()
        //     //   this.router.navigateByUrl("/adminHomePage/adminTab");
        //     // } else {
        //     //   await this.authObjObsSubs.unsubscribe();
        //     //   this.loginSuccessToastControllerMessage()
        //     //   this.router.navigateByUrl("/homepage/tabs");
        //     // }
        //   },
        //   errResponse => {
        //     loadingEl.dismiss();
        //     const errorCode = errResponse.code;
        //     let errorMessage = "";
        //     let errorHeader = "";
        //     if (errorCode === "EMAIL_NOT_FOUND") {
        //       errorMessage =
        //         "Please create account with the email you have provided.";
        //       errorHeader = "Email address not registered.";
        //       this.emailNotFoundErrorAlertMessage(
        //         errorHeader,
        //         errorMessage,
        //         loginForm
        //       );
        //     } else if (errorCode === "auth/wrong-password") {
        //       errorMessage = "Please verify your email/password and try again.";
        //       errorHeader = "Incorrect email/password.";
        //       this.incorrectPasswordErrorAlertMessage(
        //         errorHeader,
        //         errorMessage,
        //         loginForm
        //       );
        //     } else if (errorCode === 'auth/user-not-found') {
        //       errorMessage =
        //       "Please create account with the email you have provided.";
        //       errorHeader = "Email address not registered.";
        //       this.emailNotFoundErrorAlertMessage(
        //       errorHeader,
        //       errorMessage,
        //       loginForm
        //     );
        //     } else {
        //       errorMessage = "Something went wrong. Please try again.";
        //       errorHeader = "OOPS...";
        //       this.genericErrorAlertMessage(
        //         errorHeader,
        //         errorMessage,
        //         loginForm
        //       );
        //     }
        //   }
        // );
        loginForm.reset();
      });
  }

  async loginSuccessToastControllerMessage() {
    const authData = Plugins.Storage.get({key: 'authData'});
    authData.then(async data => {
      const loginDetails = JSON.parse(data.value);
      const loginSuccessToast = await this.loginSuccessToastCtrl.create({
        message : `Successfully logged in as ${loginDetails.email}`,
        duration: 1500,
        position: 'bottom',
        color: 'success'
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
        // console.log("DATA DATSSAAAA *", data);
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
        // else {

        // }
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
      .then(data => {
        console.log("came here on close", data);
        // if (data.role === "LOGIN_SUCCESS") {
        //   if (data.data === "ENTERPRISE_PARTNER") {
        //     this.router.navigateByUrl("/partnerHomePage/partnerTabs");
        //   } else if (data.data === "GENERAL_ADMIN") {
        //     this.router.navigateByUrl("/adminHomePage/adminTab");
        //   } else if (data.data === "CUSTOMER") {
        //     // this.router.navigateByUrl("/homepage/tabs/account");
        //     this.router.navigateByUrl("/homepage/tabs");
        //   }
        // } else {
        //   this.router.navigateByUrl("/homepage/tabs");
        // }
      });
  }

}
