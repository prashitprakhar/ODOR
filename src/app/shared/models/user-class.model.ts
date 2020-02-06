export class UserClassModel {

    constructor(
      public id: string,
      public email: string,
      private _token: string,
      private tokenExpirationDate: Date,
      private username: string,
      // private role: string
    ) {}
  
    get token() {
      // console.log("New Date()", new Date());
      const localTimeFromAuthState = new Date(this.tokenExpirationDate).toLocaleString();
      const splittedLocalTime = localTimeFromAuthState.split('/');
      const newDateFormatted = splittedLocalTime[1] + '/' + splittedLocalTime[0] + '/' + splittedLocalTime[2];
      const localeTimeFormatted = new Date(newDateFormatted);
      if (!this.tokenExpirationDate || (localeTimeFormatted <= new Date())) {
        return null;
        }
      return this._token;
    }

    get tokenDuration() {
      if (!this.token) {
        return 0;
      }
      return this.tokenExpirationDate;
    }
  }
