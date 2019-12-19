import { Injectable, OnDestroy } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, from } from "rxjs";
import { map, tap, take } from "rxjs/operators";
import { IAuththenticationResponse } from "./../shared/models/authentication-response.model";
import { environment } from "./../../environments/environment";
import { UserClass } from "./../shared/models/user.model";

@Injectable({
  providedIn: "root"
})
export class AuthService implements OnDestroy {
  // private _userIsAuthenticated: boolean = true;

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

  constructor(private http: HttpClient) {}

  autoLogin() {
    return from(Plugins.Storage.get({ key: "authData" })).pipe( // 'from' converts any Promise to Observable
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

        const expirationTime = new Date(parsedAuthData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new UserClass(parsedAuthData.userId, parsedAuthData.email, parsedAuthData.token, expirationTime);
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration)
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<IAuththenticationResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    } , duration);
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  signup(email: string, password: string) {
    return this.http
      .post<IAuththenticationResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(take(1), tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: IAuththenticationResponse) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new UserClass(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );

    this._user.next(user);

    this.autoLogout(user.tokenDuration);

    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
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
  }
}
