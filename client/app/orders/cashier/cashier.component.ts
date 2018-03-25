import { Component, OnInit, AfterViewInit, Injectable , Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OrderService } from 'app/services/order.service';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { get } from 'selenium-webdriver/http';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import {  Router } from '@angular/router';
import { LocalStorage } from 'app/shared/local-storage.service';


@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent implements OnInit , OnDestroy {

 shippmentForm: FormGroup;
  openStep: Number = 1;
  maxStep: Number = 1;
  sub; sub2;
  public user: any = { addresses: [{}]};
  public paypalConfig: any = {};


  constructor(public orderService: OrderService,
              public auth: AuthService,
              private userService: UserService,
              public router: Router,
              @Inject(PLATFORM_ID) protected platformId: Object,
              private localStorage: LocalStorage) {
  }

  ngOnInit() {
    this.setUser();
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
      if (isPlatformBrowser(this.platformId)) {
        window.document.getElementById('paypal-button-container').innerHTML = '';
        console.log('create paypal' + this.paypalConfig.env);
        window['paypal'].Button.render({
          env: this.paypalConfig.env,
          client: this.paypalConfig.client,
          commit: this.paypalConfig.commit,
          locale: 'he_IL',
          payment: (data, actions) => {
            let palRes = null;
              const orderId = localStorage.getItem('orderId');
              console.log('payment' + orderId);
              const CREATE_URL = '/api/paypal/payment/create/' + orderId;
              palRes =  window['paypal'].request.post(CREATE_URL)
                  .then(function(res) {
                      console.log('set payment' + res);
                      return actions.payment.create(res);
                  });
            return palRes;
          },
          onAuthorize:  (data, actions) => {
            console.log('onAuthorize paypal');
            const parent = this;
            const dataParent = data;
            return actions.payment.execute().then(function() {
              // Update status
              const orderId = parent.localStorage.getItem('orderId');
              parent.sub2 = parent.orderService.createServerOrderStatus(orderId, 'payed', dataParent).subscribe(info => {
                  parent.router.navigateByUrl('/summary');
                },
                error => console.log(error),
                () => console.log('finaly')
              );
            });
          },
          style: this.paypalConfig.style
        }, '#paypal-button-container');
      }
  }


  onSubmitStep1() {
    if (this.auth.loggedIn) {
      if (this.orderService.orderContainer.delivery === 'SelfPick') {
        this.openStep2();
      } else {
        // Update User info
        this.sub = this.userService.updateAddressForUser(
          this.auth.currentUser,
          this.orderService.orderContainer
        ).subscribe(data => {
          this.openStep2();
        },
        error => console.log(error)
      );
    }
    } else {
      this.openStep2();
    }
  }

  openStep2() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.orderService.createServerOrder().subscribe(data => {
        if (isPlatformBrowser(this.platformId)) {
          this.localStorage.setItem('orderId', data._id);
          this.setPayPal();
        }
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
        if (!this.orderService.orderContainer.name) {
          this.orderService.orderContainer.name = this.user.username;
          this.orderService.orderContainer.email = this.user.email;
          if (!this.orderService.orderContainer.address1 &&
            this.user.addresses.length > 0 &&
            this.orderService.orderContainer.delivery !== 'SelfPick') {
            this.orderService.orderContainer.address1 = this.user.addresses[0].address1;
            this.orderService.orderContainer.address2 = this.user.addresses[0].address2;
            this.orderService.orderContainer.city = this.user.addresses[0].city;
            this.orderService.orderContainer.zip = this.user.addresses[0].zip;
            this.orderService.orderContainer.phone = this.user.phone;
            }
        }
        },
        error => console.log(error)
      );
    }
  }


  onDeliveryChange(newValue) {
    this.orderService.persist();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

}


