// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend: 'http://localhost:2002/graphql',
  backendWs: 'ws://localhost:2002/graphql',
  stripePublicKey: 'pk_test_51Ix7GiD0BBhD1EyuL2ahdWFY9tUkAv9W5ISz4YCIov4i3vEyyVVaFC3M6im8cvl03IXINv6lyGq9dj9tRPm0eDhc00aDhXyXgG'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
