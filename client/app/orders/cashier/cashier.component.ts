import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OrderService } from 'app/services/order.service';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { get } from 'selenium-webdriver/http';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent implements OnInit , OnDestroy {
  
  shippmentForm: FormGroup;
  openStep: Number = 1;
  maxStep: Number = 1;
  public user: any = { addresses: [{}]};
  sub1;
  constructor(public orderService: OrderService,
              public auth: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.setUser();
  }



  get name() { return this.shippmentForm.get('name'); }

  onSubmitStep1() {
    debugger;
    if (this.auth.loggedIn) {
      // Update User info
      this.sub1 = this.userService.editUser(this.user).subscribe(data => {
        this.openStep2();
      },
      error => console.log(error)
    );
    } else {
      this.user.role = 'guest'
      this.sub1 = this.userService.addUser(this.user).subscribe(data => {
        this.auth.injectUser(JSON.parse(data._body));
        this.openStep2();
      },
      error => console.log(error)
    );
    }
  }

  openStep2() {
    debugger;
    this.sub1.unsubscribe();
    this.openStep = 2;
    if (this.maxStep === 1)
    {
      this.maxStep = 2;
    }
  }

  setUser() {
    if (this.auth.currentUser._id && this.auth.currentUser._id !== '') {
      this.userService.getUser(this.auth.currentUser).subscribe(
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

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

}
