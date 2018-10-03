import { Component, OnInit } from '@angular/core';
import { OrderService } from 'app/services/order.service';
import { Order } from 'app/model/order';
import {Location} from '@angular/common';
import { ShoeService } from 'app/services/shoe.service';
import { GoogleAnalyticsEventsService } from 'app/shared/google-analytics-events.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public orders: Order[];
  constructor(public orderService: OrderService,
              private location: Location,
              public shoeService: ShoeService,
              public googleService: GoogleAnalyticsEventsService,
              private router: Router) { }

  ngOnInit() {
    this.orders = this.orderService.getOrders();
    this.googleService.emitEvent('Order', 'Pre Cashier');
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 200)
  });
  }

  backClicked() {
    this.location.back();
  }

  removeOrder(order) {
    this.orderService.removeOrder(order);
  }

  onAmountChange(newValue) {
    this.orderService.persist();
  }

  onDeliveryChange(newValue) {
    this.orderService.persist();
  }


}
