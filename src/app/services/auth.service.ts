import { Injectable } from "@angular/core";
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _userIsAuthenticated: boolean = true;

  private _userIsEnterprisePartner: boolean = false;
  private _userIsCustomer: boolean = false;
  private _userId: string = 'testUser';

  get userIsEnterprisePartner() {
    return this._userIsEnterprisePartner;
  }

  get userIsCustomer() {
    return this._userIsCustomer;
  }

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor() {
  }

  async login(email, password) {
    if (email !== "p@p.c") {
      this._userIsCustomer = true;
      this._userIsEnterprisePartner = false;
      this._userIsAuthenticated = true;

    } else {
      const storage = await Plugins.Storage.set({key: 'shopId', value: JSON.stringify('SUDARSHANNAGARSHOP1')});
      this._userIsAuthenticated = true;
      this._userIsCustomer = false;
      this._userIsEnterprisePartner = true;
      // console.log("Came Here",this._userIsEnterprisePartner)
    }

  }

  logout() {
    this._userIsCustomer = false;
    this._userIsEnterprisePartner = false;
    this._userIsAuthenticated = false;
  }
  // tslint:disable-next-line: no-trailing-whitespace
}
