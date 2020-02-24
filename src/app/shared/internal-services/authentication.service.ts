import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, from } from "rxjs";
import { map, tap, take } from "rxjs/operators";
import { environment } from "./../../../environments/environment";
import { UserClassModel } from "./../../shared/models/user-class.model";
import { HttpApiService } from '../services/http-api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  private userAuthAPI: string = environment.internalAPI.userAuth;
  private _userIsEnterprisePartner: boolean = false;
  private _userIsCustomer: boolean = false;
  private _user = new BehaviorSubject<UserClassModel>(null);
  private activeLogoutTimer: any;
  private _userAuthState = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient,
              private httpAPIService: HttpApiService,
              private router: Router) {}

  get userAuthState() {
    return from(Plugins.Storage.get({ key: "authData" })).pipe(take(1));
  }

  get userId() {
    return this._user.asObservable().pipe(
      take(1),
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  // emitExpirationTimeRemianing() {

  // }

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

  signup(username, email, password, role, securePIN) {
    const payload = {
      username,
      email,
      password,
      role,
      securePIN
    };
    return from(this.http.post(`${this.userAuthAPI}signup`, payload)).pipe(
      take(1)
    );
  }

  createUserProfile(data) {
    // const userInfo = data.user.toJSON();
    // const userData = {
    //   email : userInfo.email,
    //   displayName : userInfo.displayName,
    //   phoneNumber: userInfo.phoneNumber,
    //   photoURL: userInfo.photoURL,
    //   uid: userInfo.uid,
    //   apiKey: userInfo.apiKey,
    //   refreshToken: userInfo.stsTokenManager.refreshToken,
    //   accessToken: userInfo.stsTokenManager.accessToken,
    //   expirationTime: userInfo.stsTokenManager.expirationTime,
    //   emailVerified : userInfo.emailVerified,
    //   lastLoginAt : userInfo.lastLoginAt,
    //   createdAt : userInfo.createdAt,
    //   role: 'CUSTOMER'
    // };
    // return from(this.db.collection('USER_PROFILE').add(userData)).pipe(
    //   take(1)
    // );
  }

  private createExpirationDate(loginDateTime, days) {
    const result = new Date(loginDateTime);
    // result.setDate(result.getDate() + 1);
    result.setDate(result.getDate() + days);
    return result;
  }

  private setUserData(userData) {
    const userInfo = userData.user;
    const email = userInfo["email"];
    const token = userData.token;
    const loginSignupdate = userInfo["lastLoggedInAt"];
    const userId = userInfo["_id"];
    const username = userInfo["username"];
    const role = userInfo["role"];

    const localTimeFromAuthState = new Date(loginSignupdate).toLocaleString();
    const splittedLocalTime = localTimeFromAuthState.split("/");
    const newDateFormatted =
      splittedLocalTime[1] +
      "/" +
      splittedLocalTime[0] +
      "/" +
      splittedLocalTime[2];
    const localeTimeFormatted = new Date(newDateFormatted);
    const expirationDateTime = this.createExpirationDate(
      localeTimeFormatted,
      21
    );
    const user = new UserClassModel(
      userId,
      email,
      token,
      expirationDateTime,
      username,
      role
    );

    this._user.next(user);

    const currentTime = new Date();
    const currentLocalTime = currentTime.toLocaleString();
    const splittedLocalCurrentTime = currentLocalTime.split('/');
    const newFormattedCurrentTime = splittedLocalCurrentTime[1] + '/' + splittedLocalCurrentTime[0] + '/' + splittedLocalCurrentTime[2];
    const localCurrentTimeFormatted = new Date(newFormattedCurrentTime);
    const currentTimeInSec: number = new Date(localCurrentTimeFormatted).getTime();
    const expirationTimeInSec: number = new Date(expirationDateTime).getTime();
    const tokenExpirationDuration: number = expirationTimeInSec - currentTimeInSec; // This is 1 hour
    this.autoLogout(tokenExpirationDuration);

    this.storeAuthData(
      userId,
      token,
      expirationDateTime.toLocaleString(),
      email,
      username,
      role
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string,
    username: string,
    role: string
  ) {
    const authData = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
      email,
      username,
      role
    });
    Plugins.Storage.set({ key: "authData", value: authData });
  }

  login(email: string, password: string) {
    const payload = {
      email,
      password
    };
    return from(
      this.http.post(`${this.userAuthAPI}login`, payload)
    ).pipe(take(1), tap(this.setUserData.bind(this)));
    // )
    // .pipe(take(1),
    // map(loginData => {
    //   if (loginData) {
    //     this.setUserData.bind(loginData);
    //   } else {
    //     return null;
    //   }
    // })
    // );
  }

  autoLogin() {
    // console.log("Called Auto Login ****");
    return from(Plugins.Storage.get({ key: "authData" })).pipe(
      // 'from' converts any Promise to Observable
      map(storedData => {
        // console.log("storedData storedData >>>", storedData);
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedAuthData = JSON.parse(storedData.value) as {
          token: string;
          userId: string;
          tokenExpirationDate: string;
          email: string;
          username: string;
          role: string;
        };
        const splittedLocalTime = parsedAuthData.tokenExpirationDate.split('/');
        const newDateFormatted = splittedLocalTime[1] + '/' + splittedLocalTime[0] + '/' + splittedLocalTime[2];
        const localeTimeFormatted = new Date(newDateFormatted);
        const expirationTime = new Date(localeTimeFormatted);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new UserClassModel(
          parsedAuthData.userId,
          parsedAuthData.email,
          parsedAuthData.token,
          expirationTime,
          parsedAuthData.username,
          parsedAuthData.role
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

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
    // 2147483647 is the limit
  }

  async logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    const userDate = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userDate.value);

    const userToken = userDataFetched.token;

    const payload = {
      user : {
        token : userToken
      }
    };
    const header = userToken;
    this.httpAPIService.authenticatedPostAPI(`${this.userAuthAPI}logout`, payload, header)
    .then(signoutResData => {
      Plugins.Storage.remove({ key: "authData" });
      this.router.navigateByUrl("/homepage/tabs");
      }, error => {
      });
  }

  resetPassword(email: string, password: string, securePIN: number): Promise<any> {
    const payload = {
      email,
      password,
      securePIN
    };
    // resetPassword
    return this.httpAPIService.postAPI(`${this.userAuthAPI}resetPassword`, payload);
  }
}
