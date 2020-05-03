import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {


  constructor(private permissionAlert: AlertController) { }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    // console.log('Current', coordinates);
    // this.checkUserPermission();
    // alert('Current Coordinates' + coordinates);
    return coordinates;
  }

  watchPosition() {
    // let currentPositionWatched;
    const wait = Geolocation.watchPosition({}, (position, err) => {
      if (err) {
        // currentPositionWatched = null;
        alert("Error Watch Position" + err);
        // console.log("currentPositionWatched ERROR ***", currentPositionWatched);
        // alert("Error Watch Position", err);
      }
      // currentPositionWatched = position;
      alert("position Success Change Watch Position" + position);
      console.log("currentPositionWatched ***", position);
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

  checkUserPermission() {
    // const permissionAlert = this.permissionAlert
    const permissionAlert = this.permissionAlert
          .create({
            header: 'Allow "INQWELO" to access your location ?',
            message: 'We need this to find available shops, products and offers in your location',
            buttons: [
              {
                text: "Allow While Using App",
                role: "cancel",
                cssClass: "secondary",
                handler: async cancel => {
                  const currentPosition = await this.getCurrentPosition();
                  // console.log("Current Position @@@@@@", currentPosition);
                  alert('CURRENT LOCATION ALWAYS WHEN USING APP' + currentPosition);
                  this.watchPosition();
                }
              },
              {
                text: "Allow Once",
                // role: "once",
                cssClass: "secondary",
                handler: async () => {
                  const currentPosition = await this.getCurrentPosition();
                  alert('currentPosition Alert ONCE ONLY' + currentPosition);
                }
              },
              {
                text: "Don't Allow",
                role: "never",
                cssClass: "secondary",
                handler: async () => {
                  alert("Never Save USER POSITION SET");
                }
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
  }

}
