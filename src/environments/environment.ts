// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseAPIKey : 'AIzaSyAL4mqXZ-hE9qr1winLtaeGO9kW2BfiVKQ',
  internalAPI : {
    userAuth : "http://localhost:3000/users/",
    adminFunctions : "http://localhost:3000/admin/",
    shopFunctions : "http://localhost:3000/shop/"
    // userAuth : "https://orderitapi.herokuapp.com/users/",
    // adminFunctions : "https://orderitapi.herokuapp.com/admin/",
    // shopFunctions : "https://orderitapi.herokuapp.com/shop/"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 * userAuth : "http://localhost:3000/users/",
 * adminFunctions : "http://localhost:3000/admin/",
 * shopFunctions : "http://localhost:3000/shop/",
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
