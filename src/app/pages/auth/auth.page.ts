import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { NgForm } from '@angular/forms';

// import { Storage } from '@ionic/storage';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async onLogin(loginForm: NgForm) {
    // console.log("Login Form *****",loginForm);
    if (!loginForm.valid) {
      return;
    }

    const email = loginForm.value.email;
    const password = loginForm.value.password;

    await this.authService.login(email, password)
    if (this.authService.userIsCustomer) {
      this.router.navigateByUrl("/homepage/tabs");
    } else if (this.authService.userIsEnterprisePartner) {


      this.router.navigateByUrl("/partnerHomePage/partnerTabs");
    }
    // this.loadingCtrl
    //   .create({ keyboardClose: true, message: "Logging in..." })
    //   .then(loadingEl => {
    //     loadingEl.present();
    //     setTimeout(() => {
    //       loadingEl.dismiss();
    //       this.router.navigateByUrl("/homepage/tabs");
    //     }, 2000);
    //   });

  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
  }
}
