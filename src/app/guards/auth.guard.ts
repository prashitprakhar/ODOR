import { Injectable } from '@angular/core';
import { Route, UrlSegment, Router } from '@angular/router';
import { CanLoad } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { take, tap, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../shared/internal-services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router,
              private authenticationService: AuthenticationService) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    // return this.authService.userIsAuthenticated.pipe(
    //   take(1),
    //   switchMap(isAuthenticated => {
    //     if (!isAuthenticated) {
    //       return this.authService.autoLogin();
    //     } else {
    //       return of(isAuthenticated);
    //     }
    //   }),
    // tap(isAuthenticated => {
    //   if (!isAuthenticated) {
    //     this.router.navigateByUrl('/auth');
    //   }
    // }));
    return this.authenticationService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authenticationService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        // this.router.navigate(['/homepage/tabs']);
        this.router.navigateByUrl('/auth');
      }
    })
    );
    // let userAuthentication: boolean = false;
    // this.authService.userIsAuthenticated.pipe(take(1)).subscribe(userIsAuthenticated => {
    //   if (!userIsAuthenticated) {
    //     this.router.navigateByUrl('/auth');
    //   }
    //   userAuthentication = userIsAuthenticated;
    // });
    // return userAuthentication;
  }

}
