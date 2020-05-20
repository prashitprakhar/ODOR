import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { AlertController } from "@ionic/angular";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@ionic-native/native-geocoder/ngx";
import { HttpApiService } from "./http-api.service";

import { environment } from "./../../../environments/environment";
import { IGeoSpatialDetails } from "src/app/models/geo-spatial.model";

const { Geolocation } = Plugins;

@Injectable({
  providedIn: "root",
})
export class GeoLocationService {
  public currentUserAddress: string;
  public geoSpatialEndpoint: string =
    environment.internalAPI.geoStatialFunctions;

  constructor(
    private permissionAlert: AlertController,
    private nativeGeocoder: NativeGeocoder,
    private httpAPIService: HttpApiService,
    private errorGettingLocationCoordinates: AlertController,
    private neverSaveAddressAlert: AlertController,
    private successfulAddressSavedAlert: AlertController,
    private failureSavingAddressAlert: AlertController
  ) {}

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
      if (err) {
        // currentPositionWatched = null;
        // alert("Error Watch Position" + err);
        // console.log("currentPositionWatched ERROR ***", currentPositionWatched);
        // alert("Error Watch Position", err);
      }
      // Add code to keep track of the location while Moving

      // currentPositionWatched = position;
      // alert("position Success Change Watch Position" + position);
      // console.log("currentPositionWatched ***", position);
    });
  }

  // Notification Text
  // INQWELO Would Like to Send You Notifications
  // Notifications may include alerts, sounds and icon badges. These can be configured in Settings.
  // 1. AGREE
  // 2. DISAGREE

  // LOCATION Permission
  // Allow "INQWELO" to access your location ?
  // We need this to find available shops, products and offers in your location
  // 1. Allow While Using App
  // 2. Allow Once
  // 3. Don't Allow

  // ALSO, WE WON'T SAVE ANY LOCATION DATA IN DB FOR THE CUSTOMERS.
  // KEEP ALL DATA IN LOCAL STORAGE.
  // FOR SHOPS, WE NEED TO SAVE LOCATION DATA IN DB.

  async checkUserPermission(userType?: string) {
    // const permissionAlert = this.permissionAlert
    const permissionAlert = this.permissionAlert
      .create({
        header: 'Allow "INQWELO" to access your location ?',
        message: userType
          ? userType === "ENTERPRISE_PARTNER"
            ? "We need this to allow customers find your shop on the app."
            : "We need this to find available shops, products and offers in your location"
          : "We need this to find available shops, products and offers in your location",
        buttons: [
          {
            text: "Allow While Using App",
            role: "cancel",
            cssClass: "secondary",
            handler: async (cancel) => {
              const currentPosition = await this.getCurrentPosition();
              if (currentPosition) {
                this.setUserLocationInLocalStorage(
                  currentPosition.coords.latitude,
                  currentPosition.coords.longitude
                );
                // this.saveUserLocationInDB(currentPosition.coords.latitude,
                //   currentPosition.coords.longitude);
                if (!userType) {
                  this.watchPosition();
                }

                if (userType === "ENTERPRISE_PARTNER") {
                  this.saveUserLocationInDB(
                    userType,
                    currentPosition.coords.latitude,
                    currentPosition.coords.longitude
                  );
                }
              } else {
                this.errorGettingLocationAlert();
              }
            },
          },
          {
            text: "Allow Once",
            cssClass: "secondary",
            handler: async () => {
              const currentPosition = await this.getCurrentPosition();
              if (currentPosition) {
                this.getCurrentLocationAddress(
                  currentPosition.coords.latitude,
                  currentPosition.coords.longitude
                );
                this.setUserLocationInLocalStorage(
                  currentPosition.coords.latitude,
                  currentPosition.coords.longitude
                );
                if (userType === "ENTERPRISE_PARTNER") {
                  this.saveUserLocationInDB(
                    userType,
                    currentPosition.coords.latitude,
                    currentPosition.coords.longitude
                  );
                }
              } else {
                this.errorGettingLocationAlert();
              }
            },
          },
          {
            text: "Don't Allow",
            role: "never",
            cssClass: "secondary",
            handler: async () => {
              if (userType) {
                this.neverSaveAddressSelectionAlert(userType);
              } else {
                this.neverSaveAddressSelectionAlert();
              }
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  getCurrentLocationAddress(latitude, longitude) {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    this.nativeGeocoder
      .reverseGeocode(latitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        const countryName = result[0].countryName; // 'India'
        const countryCode = result[0].countryCode; // 'IN'
        const state = result[0].administrativeArea; // 'Telangana'
        const district = result[0].subAdministrativeArea; // 'Ranga Reddy'
        const locality = result[0].locality; // 'Hyderabad'
        const subLocality = result[0].subLocality; // 'Serilingampally'
        const postalCode = result[0].postalCode; // "500019"
        const thoroughFare = result[0].thoroughfare; // 'Nallagandala Bypass Road'
        const areasOfInterest = result[0].areasOfInterest; // ['Nallagandala Bypass Road']
        this.currentUserAddress = `${thoroughFare}, ${subLocality}, ${locality}, ${state}`;
        // userAddress = this.currentUserAddress;
        // return this.currentUserAddress;
      })
      .catch((error: any) => {
        //   console.log(error);
        //   alert('Error' + error);
        // return userAddress;
      });
  }

  async setUserLocationInLocalStorage(latitude, longitude) {
    Plugins.Storage.get({ key: "authData" })
      .then((userData) => {
        const userDataFetched = JSON.parse(userData.value);
        const userId = userDataFetched.userId;
        const userType = userDataFetched.role;
        const userGeoSpatialDetails: IGeoSpatialDetails = {
          userId,
          userType,
          location: {
            type: "Point",
            coordinates: [latitude, longitude],
          },
          address: this.currentUserAddress ? this.currentUserAddress : 'NO_DATA',
        };
        Plugins.Storage.set({
          key: "geoSpatialData",
          value: JSON.stringify(userGeoSpatialDetails),
        });
      })
      .catch((err) => {
        const userGeoSpatialDetails: IGeoSpatialDetails = {
          location: {
            type: "Point",
            coordinates: [latitude, longitude],
          },
          address: this.currentUserAddress,
        };
        Plugins.Storage.set({
          key: "geoSpatialData",
          value: JSON.stringify(userGeoSpatialDetails),
        });
      });
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      const radlat1 = (Math.PI * lat1) / 180;
      const radlat2 = (Math.PI * lat2) / 180;
      const theta = lon1 - lon2;
      const radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") {
        dist = dist * 1.609344;
      }
      if (unit === "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  errorGettingLocationAlert() {
    this.errorGettingLocationCoordinates
      .create({
        header: "Not able to get your location",
        message:
          "Please check if LOCATION SERVICE is enabled in your android device and try again.",
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: async (cancel) => {},
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  neverSaveAddressSelectionAlert(userType?: string) {
    if (userType) {
      this.neverSaveAddressAlert
        .create({
          header: "Your shop won't show up for customers.",
          message:
            "Your shop won't be visible to customers until they search for your shop by Shop Name",
          buttons: [
            {
              text: "OK",
              role: "cancel",
              cssClass: "secondary",
              handler: async (cancel) => {}
            }
          ]
        })
        .then((alertEl) => {
          alertEl.present();
        });
    }
  }

  async checkShopLocationDetails(): Promise<any> {
    const url = `${this.geoSpatialEndpoint}checkLocationDetails`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const payload = { userId };
    return this.httpAPIService.authenticatedPostAPI(url, payload, userToken);
  }

  async saveUserLocationInDB(userType: string, latitude, longitude) {
    const url = `${this.geoSpatialEndpoint}saveLocation`;
    const userData = await Plugins.Storage.get({ key: "authData" });
    const userDataFetched = JSON.parse(userData.value);
    const userToken = userDataFetched.token;
    const userId = userDataFetched.userId;
    const coordinates = [latitude, longitude];
    const payload = { userId, userType, coordinates };
    this.httpAPIService.authenticatedPostAPI(url, payload, userToken)
      .then(savedData => {
        this.successfulSavedAddressInDBAlert();
      })
      .catch(err => {
        this.failuerSavedAddressInDBAlert();
      });
  }

  successfulSavedAddressInDBAlert() {
    this.successfulAddressSavedAlert.create({
      header: 'Successfully updated Location',
      message: 'Address Successfully updated.',
      buttons: [
        {
          text: "OK",
          role: "cancel",
          cssClass: "secondary",
          handler: async (cancel) => {}
        }
      ]
    })
    .then((alertEl) => {
      alertEl.present();
    });
  }

  failuerSavedAddressInDBAlert() {
    this.failureSavingAddressAlert.create({
      header: 'OOPS... Something went wrong',
      message: `Your address couldn't be saved. Please try again.`,
      buttons: [
        {
          text: "OK",
          role: "cancel",
          cssClass: "secondary",
          handler: async (cancel) => {}
        }
      ]
    })
    .then((alertEl) => {
      alertEl.present();
    });
  }

}
