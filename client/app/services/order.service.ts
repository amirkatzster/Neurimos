import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from 'app/services/auth.service';
import { Order } from 'app/model/order';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { RequestOptions, Headers, Http } from '@angular/http';



@Injectable()
export class OrderService {

  public orders: Array<Order>;
  private obsArray: Array<Order>;
  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private authService: AuthService,
              private router: Router,
              private http: Http) {
      this.orders = JSON.parse(localStorage.getItem('orders'));
      if (!this.orders) {
        this.orders = [];
      }
  }


  newOrder(shoe: any, imageGroup: any, size: String ) {
    let order = this.orders.find(o => o.shoe._id === shoe._id && o.imageGroup.color === imageGroup.color && o.size === size);
    if (!order) {
      order = new Order();
      order.shoe = shoe;
      order.imageGroup = imageGroup;
      order.size = size;
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
      subTotal += o.amount * o.shoe.finalPrice;
    });
    return subTotal;
  }

  shippment() {
    return 20;
  }

  deliveryMethod() {
    return 'mail';
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

  createServerOrder(user): Observable<any> {
    const serverOrder = {
      status: 'created',
      user: user._id,
      totalPrice: this.total(),
      customer: {
        name         : user.username,
        email        : user.email,
        phone        : user.phone,
        address1     : user.addresses[0].address1,
        address2     : user.addresses[0].address2,
        city         : user.addresses[0].city,
        zip          : user.addresses[0].zip
      },
      items    : [],
      shippment: {
        deliveryMethod : this.deliveryMethod(),
        price : this.shippment()
      }
    };
    this.orders.forEach(o => {
      const item = {
        model:  o.shoe.name,
        company: o.shoe.company,
        imageUrl: o.imageGroup.images[0].urlMedium,
        size: o.size,
        amount: o.amount,
        pricePerItem: o.shoe.finalPrice
      }
      serverOrder.items.push(item);
    });
    return this.http.post('/api/order', JSON.stringify(serverOrder), this.options);
  }

  createServerOrderStatus(orderId, newStatus, ppData): Observable<any> {
    return this.http.post(`/api/order/${orderId}/${newStatus}`, JSON.stringify(ppData), this.options);
  }

}
