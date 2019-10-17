import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { NgForm } from '@angular/forms';

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

  onLogin() {
    this.authService.login();
    // this.loadingCtrl
    //   .create({ keyboardClose: true, message: "Logging in..." })
    //   .then(loadingEl => {
    //     loadingEl.present();
    //     setTimeout(() => {
    //       loadingEl.dismiss();
    //       this.router.navigateByUrl("/homepage/tabs");
    //     }, 2000);
    //   });
    this.router.navigateByUrl("/homepage/tabs");
  }

  onSubmit(form: NgForm) {
    console.log("form Object",form)
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
  }
}
