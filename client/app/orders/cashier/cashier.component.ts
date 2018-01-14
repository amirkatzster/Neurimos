import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OrderService } from 'app/services/order.service';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { get } from 'selenium-webdriver/http';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import {  Router } from '@angular/router';


@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent implements OnInit , OnDestroy {
  
 shippmentForm: FormGroup;
  openStep: Number = 1;
  maxStep: Number = 1;
  sub;
  public user: any = { addresses: [{}]};
  public paypalConfig : any = {};


  constructor(public orderService: OrderService,
              public auth: AuthService,
              private userService: UserService,
              public router: Router) {
  }

  ngOnInit() {
    this.setUser();
    this.setPayPal();
  }

  setPayPal() {
    this.paypalConfig.env = environment.production ? 'production' : 'sandbox';
    this.paypalConfig.commit = true;
    this.paypalConfig.client = {
      sandbox:    'Ae7k2-oU7q53lceDTG6VNQJGGtP6k0_kzWzSNJQh8KzHHznl7voSrGsm44reeqnlHHsyXlIzVXpMIa06',
      production: 'AZ92mKKhBghaj00qr84B99ydLivbX13iH7NqXubHcYZ9-EVhe6_As6XbBARB-lM2t0wJK_4J4nYtRWYW'
    };
    this.paypalConfig.style = {
          size: 'medium',
          color: 'gold',
          shape: 'pill',
          label: 'buynow',
          fundingicons: true,
          branding: true,
      };
      window['paypal'].Button.render({
        env: 'sandbox',
        client: this.paypalConfig.client,
        commit: this.paypalConfig.commit,
        locale: 'he_IL',
        payment: this.payment,
        onAuthorize:  (data, actions) => {
          const parent = this;
          const dataParent = data;
          return actions.payment.execute().then(function() {
            // Update status
            parent.orderService.createServerOrderStatus(localStorage.getItem('orderId'), 'payed', dataParent).subscribe(
              info => {
                parent.router.navigateByUrl('/summary')
              }
            );
          });
        },
        style: this.paypalConfig.style
      }, '#paypal-button-container');
  }


  onSubmitStep1() {
    if (this.auth.loggedIn) {
      // Update User info
      this.sub = this.userService.editUser(this.user).subscribe(data => {
        this.openStep2();
      },
      error => console.log(error)
    );
    } else {
      this.user.role = 'guest'
      this.sub = this.userService.addUser(this.user).subscribe(data => {
        this.auth.injectUser(JSON.parse(data._body));
        this.openStep2();
      },
      error => console.log(error)
    );
    }
  }

  openStep2() {
    this.sub.unsubscribe();
    this.sub = this.orderService.createServerOrder(this.user).subscribe(data => {
        localStorage.setItem('orderId', JSON.parse(data._body)._id);
        this.openStep = 2;
        if (this.maxStep === 1) {
        this.maxStep = 2;
      }
    },
    error => console.log(error));
  }

  openStep3() {
    this.openStep = 3;
    if (this.maxStep === 2) {
      this.maxStep = 3;
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

  payment(data, actions) {
    const CREATE_URL = '/api/paypal/payment/create/' + localStorage.getItem('orderId');
    // Make a call to your server to set up the payment
    return window['paypal'].request.post(CREATE_URL)
        .then(function(res) {
            return actions.payment.create(res);
        });
  }



  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}


