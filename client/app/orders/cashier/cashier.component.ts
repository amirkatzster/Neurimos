import { Component, OnInit } from '@angular/core';
import { OrderService } from 'app/services/order.service';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent implements OnInit {

  public user: any = { addresses: [{}]};
  constructor(public orderService: OrderService,
              public auth: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    if (this.auth.currentUser) {
      this.userService.getUser(this.auth.currentUser._id).subscribe(
        data => {
        this.user = data;
        if (!this.user.addresses || this.user.addresses.length === 0) {
          this.user.addresses = [];
          this.user.addresses.push({});
        }
        },
        error => console.log(error)
      );
    } 
  }

}
