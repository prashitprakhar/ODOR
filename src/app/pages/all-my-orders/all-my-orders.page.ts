import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-all-my-orders',
  templateUrl: './all-my-orders.page.html',
  styleUrls: ['./all-my-orders.page.scss'],
})
export class AllMyOrdersPage implements OnInit {

  constructor(private userProfileService: UserProfileService) { }

  ngOnInit() {
    const userOrders = this.userProfileService.getUserOrder();
    console.log("User Orders *********",userOrders)
  }

}
