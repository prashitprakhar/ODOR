import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  AlertController,
  LoadingController,
  ModalController
} from "@ionic/angular";
// import { AuthService } from "src/app/services/auth.service";
// import { Router } from "@angular/router";
import { AuthenticationService } from "../../internal-services/authentication.service";
import { MustMatch } from "./../../utils/must-match.validator";
import { IsNumberMatch } from "./../../utils/is-number.validator";

@Component({
  selector: "app-signup-modal",
  templateUrl: "./signup-modal.component.html",
  styleUrls: ["./signup-modal.component.scss"]
})
export class SignupModalComponent implements OnInit {
  // private API_KEY = "AIzaSyAL4mqXZ-hE9qr1winLtaeGO9kW2BfiVKQ";
  public signupForm: FormGroup;

  constructor(
    private signupModalCtrl: ModalController,
    // private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private signupSuccessAlertCtrl: AlertController,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        securePin: ["", [Validators.required, Validators.minLength(4)]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(8)]]
      },
      // { validator: [MustMatch("password", "confirmPassword"), IsNumberMatch("securePin")] },
      { validator: MustMatch("password", "confirmPassword") },
    );
  }

  get f() {
    return this.signupForm.controls;
  }

  onClose() {
    this.signupModalCtrl.dismiss(null, "ALL_READY_MEMBER", "signupModal");
  }

  onSignup() {
    if (!this.signupForm.valid) {
      return;
    }
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    const securePIN = this.signupForm.value.securePin;
    const role = "CUSTOMER";

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Creating Your Account..." })
      .then(signupEl => {
        signupEl.present();
        this.authenticationService
          .signup(email, email, password, role, securePIN)
          .subscribe(
            resData => {
              // console.log("New Sign up Res Data ********", resData);
              signupEl.dismiss();
              this.signupModalCtrl.dismiss(null, "closed", "signupModal");
            },
            err => {
              signupEl.dismiss();
              let errorMessage = "";
              let headerLabel = "";
              // console.log("Error Occured");
              errorMessage = "Something went wrong. Please try again.";
              headerLabel = "OOPS...";
              this.genericErrorAlertMessage(
                headerLabel,
                errorMessage,
                this.signupForm
              );
            }
          );
      });
  }

  // onSignup(signupForm: NgForm) {
  //   if (!signupForm.valid) {
  //     return;
  //   }
  //   const email = signupForm.value.email;
  //   const password = signupForm.value.password;
  //   const role = "CUSTOMER";
  //   // const confirmPasword = signupForm.value.confirmPasword;

  //   this.loadingCtrl
  //     .create({ keyboardClose: true, message: "Creating Your Account..." })
  //     .then(signupEl => {
  //       signupEl.present();
  //       this.authenticationService
  //         .signup(email, email, password, "CUSTOMER")
  //         .subscribe(
  //           resData => {
  //             // console.log("New Sign up Res Data ********", resData);
  //             signupEl.dismiss();
  //             this.signupModalCtrl.dismiss(null, "closed", "signupModal");
  //           },
  //           err => {
  //             signupEl.dismiss();
  //             let errorMessage = "";
  //             let headerLabel = "";
  //             console.log("Error Occured");
  //             errorMessage = "Something went wrong. Please try again.";
  //             headerLabel = "OOPS...";
  //             this.genericErrorAlertMessage(
  //               headerLabel,
  //               errorMessage,
  //               signupForm
  //             );

  //           }
  //         );
  //       // this.authService.signup(email, password).subscribe(
  //       //   resData => {
  //       //     // console.log("resdatd.json",resData.toJson())
  //       //     signupEl.dismiss();
  //       //     // console.log("Signup response data", resData);
  //       //     this.signupModalCtrl.dismiss(null, "closed", "signupModal");
  //       //   },
  //       //   errRes => {
  //       //     signupEl.dismiss();
  //       //     // const errorCode = errRes.error.error.message;
  //       //     let errorMessage = "";
  //       //     let headerLabel = "";
  //       //     // if (errorCode === "EMAIL_EXISTS") {
  //       //     if (errRes.code === "EMAIL_EXISTS") {
  //       //       errorMessage =
  //       //         "Do you want to create account with a different email ?";
  //       //       headerLabel = "Email already exists.";
  //       //       this.emailAlreadyExistsAlertMessage(
  //       //         headerLabel,
  //       //         errorMessage,
  //       //         signupForm
  //       //       );
  //       //     } else if (errRes.code === 'auth/email-already-in-use') {
  //       //       errorMessage =
  //       //         "Do you want to create account with a different email ?";
  //       //       headerLabel = "Email already exists.";
  //       //       this.emailAlreadyExistsAlertMessage(
  //       //         headerLabel,
  //       //         errorMessage,
  //       //         signupForm
  //       //       );
  //       //     } else {
  //       //       errorMessage = "Something went wrong. Please try again.";
  //       //       headerLabel = "OOPS...";
  //       //       this.genericErrorAlertMessage(
  //       //         headerLabel,
  //       //         errorMessage,
  //       //         signupForm
  //       //       );
  //       //     }
  //       //   }
  //       // );
  //     });
  // }

  genericErrorAlertMessage(headerLabel, errorMessage, signupForm) {
    this.alertCtrl
      .create({
        header: headerLabel,
        message: errorMessage,
        buttons: [
          {
            text: "OK",
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
              this.signupModalCtrl.dismiss(
                null,
                "ALL_READY_MEMBER",
                "signupModal"
              );
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
