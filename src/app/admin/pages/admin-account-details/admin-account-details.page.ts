import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/internal-services/authentication.service';

@Component({
  selector: 'app-admin-account-details',
  templateUrl: './admin-account-details.page.html',
  styleUrls: ['./admin-account-details.page.scss'],
})
export class AdminAccountDetailsPage implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  onLogout() {
    // this.authService.logout();
    this.authenticationService.logout();
    // this.router.navigateByUrl('/auth');
  }

}
