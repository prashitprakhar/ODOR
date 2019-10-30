import { Injectable } from '@angular/core';
import { Route, UrlSegment, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsCustomerGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    console.log("this.authService.userIsCustomer",this.authService.userIsCustomer)
    return this.authService.userIsCustomer;
  }

}
