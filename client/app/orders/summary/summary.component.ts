import { Component, OnInit } from '@angular/core';
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
              private location: Location) { }

  ngOnInit() {
    this.orderService.cleanOrders();
  }

  orderId() {
    return localStorage.getItem('orderId')
  }

  backClicked() {
    this.location.back();
  }

}
