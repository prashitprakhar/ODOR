export class UserClass {

  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private tokenExpirationDate: Date
  ) {}

  get token() {
    // console.log("New Date()", new Date());
    const localTimeFromAuthState = new Date(this.tokenExpirationDate).toLocaleString();
    const splittedLocalTime = localTimeFromAuthState.split('/');
    const newDateFormatted = splittedLocalTime[1] + '/' + splittedLocalTime[0] + '/' + splittedLocalTime[2];
    const localeTimeFormatted = new Date(newDateFormatted);
    // console.log(" this.tokenExpirationDate ", localeTimeFormatted);
    // console.log("(this.tokenExpirationDate <= new Date())", (localeTimeFormatted <= new Date()));
    // if (!this.tokenExpirationDate || (this.tokenExpirationDate <= new Date())) {
    if (!this.tokenExpirationDate || (localeTimeFormatted <= new Date())) {
      // console.log("Came inside If condition user model");
      return null;
      }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      // console.log("***No Token ***");
      return 0;
    }
    return this.tokenExpirationDate;
    // .getTime();
    // - new Date().getTime();
  }

}
