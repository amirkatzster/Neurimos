import { Component, OnInit } from '@angular/core';
import { OrderService } from 'app/services/order.service';
import { Order } from 'app/model/order';
import {Location} from '@angular/common';
import { ShoeService } from 'app/services/shoe.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public orders: Order[];
  constructor(public orderService: OrderService,
              private location: Location,
              public shoeService: ShoeService) { }

  ngOnInit() {
    this.orders = this.orderService.getOrders();
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

  totalAmount() {
    let totalAmount = 0;
    this.orders.forEach(o => {
      totalAmount += o.amount;
    });
    return totalAmount;
  }

  subTotal() {
    let subTotal = 0;
    this.orders.forEach(o => {
      subTotal += o.amount * o.shoe.price;
    });
    return subTotal;
  }

  shippment() {
    return 20;
  }

  total() {
    return this.subTotal() + this.shippment();
  }

  

}
