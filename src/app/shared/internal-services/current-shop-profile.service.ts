import { Injectable } from '@angular/core';
import { IShopProfile } from 'src/app/models/shop-profile.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentShopProfileService {

  constructor() { }

  private _currentShopProfile: IShopProfile;

  public get currentShopProfile(): IShopProfile {
    return this._currentShopProfile;
  }
  public set currentShopProfile(value: IShopProfile) {
    this._currentShopProfile = value;
  }
}
