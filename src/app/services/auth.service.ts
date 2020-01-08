import { Injectable, OnDestroy } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, from } from "rxjs";
import { map, tap, take } from "rxjs/operators";
// import { IAuththenticationResponse } from "./../shared/models/authentication-response.model";
// import { environment } from "./../../environments/environment";
import { UserClass } from "./../shared/models/user.model";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class AuthService implements OnDestroy {

  constructor(
    private http: HttpClient,
    private angularFireAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  private _userIsEnterprisePartner: boolean = false;
  private _userIsCustomer: boolean = false;
  private _user = new BehaviorSubject<UserClass>(null);
  private activeLogoutTimer: any;

  get userIsEnterprisePartner() {
    return this._userIsEnterprisePartner;
  }

  get userIsCustomer() {
    return this._userIsCustomer;
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        // This check is for behaviour subject being null initially
        if (user) {
          return !!user.token; // !! means it converts string to boolean
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  onAuthStateChanged() {
    this.angularFireAuth.auth.onAuthStateChanged(user => {
      console.log("User authstateCangeveghdvjdckdcdc", user);
    })
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: "authData" })).pipe(
      // 'from' converts any Promise to Observable
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedAuthData = JSON.parse(storedData.value) as {
          token: string;
          userId: string;
          tokenExpirationDate: string;
          email: string;
        };
        const splittedLocalTime = parsedAuthData.tokenExpirationDate.split('/');
        const newDateFormatted = splittedLocalTime[1] + '/' + splittedLocalTime[0] + '/' + splittedLocalTime[2];
        const localeTimeFormatted = new Date(newDateFormatted);
        // const expirationTime = new Date(parsedAuthData.tokenExpirationDate);
        const expirationTime = new Date(localeTimeFormatted);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new UserClass(
          parsedAuthData.userId,
          parsedAuthData.email,
          parsedAuthData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          const tokenExpirationDuration: number = new Date(user.tokenDuration).getTime();
          const currentTime = new Date();
          const currentLocalTime = currentTime.toLocaleString();
          const splittedLocalCurrentTime = currentLocalTime.split('/');
          // tslint:disable-next-line: max-line-length
          const newFormattedCurrentTime = splittedLocalCurrentTime[1] + '/' + splittedLocalCurrentTime[0] + '/' + splittedLocalCurrentTime[2];
          const localCurrentTimeFormatted = new Date(newFormattedCurrentTime);

          const localTimeFromAuthState = new Date(tokenExpirationDuration).toLocaleString();
          const splittedLocalTime = localTimeFromAuthState.split('/');
          const newDateFormatted = splittedLocalTime[1] + '/' + splittedLocalTime[0] + '/' + splittedLocalTime[2];
          const localeTimeFormatted = new Date(newDateFormatted);

          const currentTimeInSec: number = new Date(localCurrentTimeFormatted).getTime();
          const expirationTimeInSec: number = new Date(localeTimeFormatted).getTime();
          const tokenExpirationDurationMilliSec: number = expirationTimeInSec - currentTimeInSec; // This is 1 hour
          this.autoLogout(tokenExpirationDurationMilliSec);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  login(email: string, password: string) {
    return from(
      this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
    ).pipe(take(1), tap(this.setUserData.bind(this)));
    // .subscribe(loginData => {
    //   console.log("Login Data ********",loginData)
    // })
    // return this.http
    //   .post<IAuththenticationResponse>(
    //     `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
    //     {
    //       email,
    //       password,
    //       returnSecureToken: true
    //     }
    //   )
    //   .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    from(this.angularFireAuth.auth.signOut()).pipe(take(1)).subscribe(signoutResData => {
      Plugins.Storage.remove({ key: "authData" });
    }, error => {
    });
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
    // 2147483647 is the limit
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  signup(email: string, password: string) {
    return from(
      this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
    ).pipe(take(1), tap(this.setUserData.bind(this)),
    tap(this.createUserProfile.bind(this)));
  }

  createUserProfile(data) {
    const userInfo = data.user.toJSON();
    const userData = {
      email : userInfo.email,
      displayName : userInfo.displayName,
      phoneNumber: userInfo.phoneNumber,
      photoURL: userInfo.photoURL,
      uid: userInfo.uid,
      apiKey: userInfo.apiKey,
      refreshToken: userInfo.stsTokenManager.refreshToken,
      accessToken: userInfo.stsTokenManager.accessToken,
      expirationTime: userInfo.stsTokenManager.expirationTime,
      emailVerified : userInfo.emailVerified,
      lastLoginAt : userInfo.lastLoginAt,
      createdAt : userInfo.createdAt,
      role: 'CUSTOMER'
    };
    return from(this.db.collection('USER_PROFILE').add(userData)).pipe(
      take(1)
    );
  }

  // private setUserData(userData: IAuththenticationResponse) {
  private setUserData(userData) {
    this.getAuthState().subscribe(
      authStateData => {
        const userAuthStateInfo = authStateData.toJSON();
        const email = userAuthStateInfo['email'];
        const userId = userAuthStateInfo['uid'];
        const refreshToken = userAuthStateInfo["stsTokenManager"].refreshToken;
        const expirationTime = userAuthStateInfo["stsTokenManager"].expirationTime;
        const localTimeFromAuthState = new Date(expirationTime).toLocaleString();
        const splittedLocalTime = localTimeFromAuthState.split('/');
        const newDateFormatted = splittedLocalTime[1] + '/' + splittedLocalTime[0] + '/' + splittedLocalTime[2];
        const localeTimeFormatted = new Date(newDateFormatted);
        console.log("user.tokenDuration user.tokenDuration", localeTimeFormatted);
        // const user = new UserClass(userId, email, refreshToken, expirationTime);
        const user = new UserClass(userId, email, refreshToken, localeTimeFormatted);

        this._user.next(user);
        // console.log("user.tokenDuration user.tokenDuration", localTimeFromAuthState);
        // const localTime = new Date(user.tokenDuration).toLocaleString();
        const currentTime = new Date();
        const currentLocalTime = currentTime.toLocaleString();
        const splittedLocalCurrentTime = currentLocalTime.split('/');
        const newFormattedCurrentTime = splittedLocalCurrentTime[1] + '/' + splittedLocalCurrentTime[0] + '/' + splittedLocalCurrentTime[2];
        const localCurrentTimeFormatted = new Date(newFormattedCurrentTime);
        // const splittedLocalTime = localTime.split('/');
        // const newDateFormatted = splittedLocalTime[1] + '/' + splittedLocalTime[0] + '/' + splittedLocalTime[2];
        // const localeTimeFormatted = new Date(newDateFormatted);
        const currentTimeInSec: number = new Date(localCurrentTimeFormatted).getTime();
        const expirationTimeInSec: number = new Date(localeTimeFormatted).getTime();
        const tokenExpirationDuration: number = expirationTimeInSec - currentTimeInSec; // This is 1 hour
        this.autoLogout(tokenExpirationDuration);

        // this.storeAuthData(
        //   userId,
        //   refreshToken,
        //   new Date(expirationTime).toISOString(),
        //   email
        // );
        this.storeAuthData(
          userId,
          refreshToken,
          localeTimeFormatted.toLocaleString(),
          email
        );
      },
      error => {
        // console.log("Came Here 3333333")
      });

          // const email = userData["user"].email;
          // const userId = userData["user"].uid;
          // const refreshToken = userData["user"].refreshToken;
          // const expirationTime = new Date(new Date().getTime() + 604800000);
          // const user = new UserClass(userId, email, refreshToken, expirationTime);

          // this._user.next(user);

          // this.autoLogout(user.tokenDuration);

          // this.storeAuthData(
          //   userId,
          //   refreshToken,
          //   expirationTime.toISOString(),
          //   email
          // );

    // const expirationTime = new Date(
    //   new Date().getTime() + +userData.expiresIn * 1000
    // );
    // const user = new UserClass(
    //   userData.localId,
    //   userData.email,
    //   userData.idToken,
    //   expirationTime
    // );

    // this._user.next(user);

    // this.autoLogout(user.tokenDuration);

    // this.storeAuthData(
    //   userData.localId,
    //   userData.idToken,
    //   expirationTime.toISOString(),
    //   userData.email
    // );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const authData = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
      email
    });
    Plugins.Storage.set({ key: "authData", value: authData });
    console.log("Came HEre Data set 4444444 tokenExpirationDate", tokenExpirationDate);
  }

  getAuthState() {
    return this.angularFireAuth.authState.pipe(take(1));
  }
}
