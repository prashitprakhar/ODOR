import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";
import { from } from "rxjs";
import { map, take, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AdminFunctionsService {
  constructor(
    private http: HttpClient,
    private angularFireAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  addShopProfile(collectionId, shopProfileDetails) {
    return from(this.db.collection(collectionId).add(shopProfileDetails)).pipe(
      take(1)
      // tap(() => this.addShopProductsDoc(shopProfileDetails))
    );
  }

  addShopProductsDoc(collectionId, shopProducts) {
    return from(this.db.collection(collectionId).add(shopProducts)).pipe(
      take(1)
    );
  }

  createShopAccount(shopEmail: string, shopDisplayName: string) {
    const email = shopEmail;
    const password = "1111111111";
    return from(
      this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      take(1),
      tap(successSignupUser => {
        // console.log("User Signed Up ******",successSignupUser);
        // const signedUpUser = successSignupUser.user.toJSON();

        const newUser: firebase.User = successSignupUser.user;
        return newUser.updateProfile({
          displayName: shopDisplayName
        });
      }), tap(() => {
        this.sendPasswordResetMail(shopEmail);
      })
    );
  }

  sendPasswordResetMail(shopEmail: string) {
    return from(
      this.angularFireAuth.auth.sendPasswordResetEmail(shopEmail)
    ).pipe(take(1));
  }
}
