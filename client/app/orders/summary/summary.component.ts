import { Component, OnInit , Injectable, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OrderService } from 'app/services/order.service';
import { AuthService } from 'app/services/auth.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  constructor(public orderService: OrderService,
              public auth: AuthService,
              private location: Location,
              @Inject(PLATFORM_ID) protected platformId: Object) { }

  ngOnInit() {
    this.orderService.cleanOrders();
  }

  orderId() {
    // return localStorage.getItem('orderId')
    return '';
  }

  backClicked() {
    this.location.back();
  }

}
