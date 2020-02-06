import { Component, OnInit } from "@angular/core";
// import { NgForm } from "@angular/forms";
import { ModalController, AlertController } from "@ionic/angular";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { MustMatch } from "./../../utils/must-match.validator";
import { AuthenticationService } from "../../internal-services/authentication.service";

@Component({
  selector: "app-password-reset-modal",
  templateUrl: "./password-reset-modal.component.html",
  styleUrls: ["./password-reset-modal.component.scss"]
})
export class PasswordResetModalComponent implements OnInit {
  public isPasswordMatching: boolean = false;
  public resetPasswordForm: FormGroup;

  constructor(
    private passwordResetModal: ModalController,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private passwordResetFailAlertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        securePin: ["", [Validators.required, Validators.minLength(4)]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(8)]]
      },
      { validator: MustMatch("password", "confirmPassword") }
    );
    //   this.registerForm = this.formBuilder.group({
    //     firstName: ['', Validators.required],
    //     lastName: ['', Validators.required],
    //     email: ['', [Validators.required, Validators.email]],
    //     password: ['', [Validators.required, Validators.minLength(6)]]
    // });
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  onClose(closeType: string = "closed") {
    this.passwordResetModal.dismiss(null, closeType, "passwordResetModal");
  }

  // onResetBtnClicked(passwordResertForm: NgForm) {

  // }

  onCancelBtnClicked() {
    this.onClose("cancelled");
  }

  update() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    const email = this.resetPasswordForm.value.email;
    const newPassword = this.resetPasswordForm.value.password;
    const securePin = this.resetPasswordForm.value.securePin;
    // console.log("this.resetPasswordForm", this.resetPasswordForm);
    this.authenticationService
      .resetPassword(email, newPassword, securePin)
      .then(data => {
        console.log("Password reset successful*****", data);
        const header = 'Password reset successful';
        const message = 'Please login to continue.';
        this.successAlertMessage(header, message);
      })
      .catch(err => {
        const error = err.error;
        const errorMessage = error.split(":")[1].trim();
        if (errorMessage === "User not found") {
          const header = 'Please check your email id and try again.';
          const message = 'User not Found';
          this.failureAlertMessage(header, message);
        } else if (errorMessage === "Please check your secure PIN and try again.") {
          const header = 'Please check your secure PIN and try again.';
          const message = 'Secure PIN not matched.';
          this.failureAlertMessage(header, message);
        } else {
          const header = 'Something went wrong.';
          const message = 'Please try again.';
          this.failureAlertMessage(header, message);
        }
        // console.log("Type of error", JSON.parse(error));
        // console.log("Password reset Failed ***********", err.error);
      });
  }

  failureAlertMessage(header, message) {
    const alert = this.passwordResetFailAlertCtrl
          .create({
            header,
            message,
            //   "Please ",
            buttons: [
              {
                text: "OK",
                role: "cancel",
                cssClass: "secondary",
                handler: cancel => {
                  // console.log("Shop is closed");
                  this.resetPasswordForm.reset();
                }
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
  }

  successAlertMessage(header, message) {
    const alert = this.passwordResetFailAlertCtrl
          .create({
            header,
            message,
            //   "Please ",
            buttons: [
              {
                text: "OK",
                role: "cancel",
                cssClass: "secondary",
                handler: cancel => {
                  // console.log("Shop is closed");
                  this.resetPasswordForm.reset();
                  this.onClose();
                }
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
  }

  // checkPasswordMatch(passwordResetForm: NgForm) {
  //   console.log("checkPasswordMatch called password", passwordResetForm.value.password);
  //   console.log("checkPasswordMatch called confirm Password", passwordResetForm.value.confirmPassword);
  //   console.log("checkPasswordMatch ", passwordResetForm.value.password === passwordResetForm.value.confirmPassword);
  //   if (passwordResetForm.value.password === passwordResetForm.value.confirmPassword) {
  //     this.isPasswordMatching = true;
  //   } else {
  //     this.isPasswordMatching = false;
  //   }
  // }
}
