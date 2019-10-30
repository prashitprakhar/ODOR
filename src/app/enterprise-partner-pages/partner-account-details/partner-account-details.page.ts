import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-account-details',
  templateUrl: './partner-account-details.page.html',
  styleUrls: ['./partner-account-details.page.scss'],
})
export class PartnerAccountDetailsPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

}
