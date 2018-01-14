import { Component, OnInit } from '@angular/core';
import { OrderService } from 'app/services/order.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  constructor(public orderService: OrderService,
              public auth: AuthService) { }

  ngOnInit() {
    this.orderService.cleanOrders();
  }

  orderId() {
    return localStorage.getItem('orderId')
  }

}
