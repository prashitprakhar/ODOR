import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
// import { StoragePlugin, StoragePluginWeb } from '@capacitor/core';

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

import * as firebase from "firebase";
import { LoginModalComponent } from "./shared/modals/login-modal/login-modal.component";
import { SignupModalComponent } from "./shared/modals/signup-modal/signup-modal.component";
import { SignupSuccessModalComponent } from "./shared/modals/signup-success-modal/signup-success-modal.component";
import { PasswordResetModalComponent } from "./shared/modals/password-reset-modal/password-reset-modal.component";
import { ViewSavedAddressesModalComponent } from './modals/view-saved-addresses-modal/view-saved-addresses-modal.component';
import { AddNewAddressModalComponent } from './modals/add-new-address-modal/add-new-address-modal.component';
// import { OrderItemsDetailsComponent } from './enterprise-partner-modals/order-items-details/order-items-details.component';

const firebaseConfig = {
  apiKey: "AIzaSyAL4mqXZ-hE9qr1winLtaeGO9kW2BfiVKQ",
  authDomain: "orderitservices.firebaseapp.com",
  databaseURL: "https://orderitservices.firebaseio.com",
  projectId: "orderitservices",
  storageBucket: "orderitservices.appspot.com",
  messagingSenderId: "563958318585",
  appId: "1:563958318585:web:490ef4e63a48f1c2f86928",
  measurementId: "G-NM8WCDR12N"
};

// firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    LoginModalComponent,
    SignupModalComponent,
    SignupSuccessModalComponent,
    PasswordResetModalComponent,
    ViewSavedAddressesModalComponent,
    AddNewAddressModalComponent
  ],
  entryComponents: [
    LoginModalComponent,
    SignupModalComponent,
    SignupSuccessModalComponent,
    PasswordResetModalComponent,
    ViewSavedAddressesModalComponent,
    AddNewAddressModalComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({hardwareBackButton: false}),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

/*

    {name: '__mydb',
  driverOrder: ['indexeddb', 'sqlite', 'websql']}

*/
