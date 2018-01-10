import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from 'app/services/auth.service';
import { Order, OrderStatus } from 'app/model/order';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';



@Injectable()
export class OrderService {

  public orders: Array<Order>;
  private obsArray: Array<Order>;

  constructor(private authService: AuthService,
              private router: Router) {
      this.orders = JSON.parse(localStorage.getItem('orders'));
      if (!this.orders) {
        this.orders = [];
      }
  }


  newOrder(shoe: any, imageGroup: any, size: String ) {
    const currentUser = this.authService.currentUser;
    let order = this.orders.find(o => o.shoe._id === shoe._id && o.imageGroup.color === imageGroup.color && o.size === size);
    if (!order) {
      order = new Order();
      order.shoe = shoe;
      order.imageGroup = imageGroup;
      order.size = size;
      order.status = OrderStatus.Created;
      this.orders.push(order);
    }
    order.amount++;
    this.persist();
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

  getOrders() {
    return this.orders;
  }

  getOrdersCounter(): Observable<any> {
    return Observable.from(this.orders);
  }

  removeOrder(order) {
    const index = this.orders.indexOf(order);
    this.orders.splice(index, 1);
    this.persist();
  }



  persist() {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

}
