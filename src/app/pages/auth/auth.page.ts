import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ModalController
} from "@ionic/angular";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { SignupModalComponent } from "src/app/shared/modals/signup-modal/signup-modal.component";
import { IAuththenticationResponse } from "src/app/shared/models/authentication-response.model";
import { SignupSuccessModalComponent } from "src/app/shared/modals/signup-success-modal/signup-success-modal.component";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit, OnDestroy {
  public authObjObservable: Observable<IAuththenticationResponse>;
  public authObjObsSubs: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private signupModalCtrl: ModalController,
    private alertCtrl: AlertController,
    private signupSuccessModalCtrl: ModalController
  ) {}

  ngOnInit() {}

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
        this.authObjObservable = this.authService.login(email, password);
        this.authObjObsSubs = this.authObjObservable.subscribe(
          async resData => {
            await loadingEl.dismiss();
            if (resData.email === "mahalakshmikiranastore@gmail.com") {
              this.router.navigateByUrl("/partnerHomePage/partnerTabs");
            } else {
              await this.authObjObsSubs.unsubscribe();
              this.router.navigateByUrl("/homepage/tabs");
            }
          },
          errResponse => {
            loadingEl.dismiss();
            const errorCode = errResponse.error.error.message;
            let errorMessage = "";
            let errorHeader = "";
            if (errorCode === "EMAIL_NOT_FOUND") {
              errorMessage =
                "Please create account with the email you have provided.";
              errorHeader = "Email address not registered.";
              this.emailNotFoundErrorAlertMessage(
                errorHeader,
                errorMessage,
                loginForm
              );
            } else if (errorCode === "INVALID_PASSWORD") {
              errorMessage = "Please verify your email/password and try again.";
              errorHeader = "Incorrect email/password.";
              this.incorrectPasswordErrorAlertMessage(
                errorHeader,
                errorMessage,
                loginForm
              );
            } else {
              errorMessage = "Something went wrong. Please try again.";
              errorHeader = "OOPS...";
              this.genericErrorAlertMessage(
                errorHeader,
                errorMessage,
                loginForm
              );
            }
          }
        );
        loginForm.reset();
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
        console.log("DATA DATSSAAAA *",data)
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
}
