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
    const order: Order = new Order();
    order.shoe = shoe;
    order.imageGroup = imageGroup;
    order.size = size;
    order.status = OrderStatus.Created;
    this.orders.push(order);
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  getOrders() {
    return this.orders;
  }

  getOrdersCounter(): Observable<any> {
    return Observable.from(this.orders);
  }


}
