import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { AuthService } from 'app/services/auth.service';
import { Order, OrderContainer } from 'app/model/order';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorage } from 'app/shared/local-storage.service';



@Injectable()
export class OrderService {

  public orderContainer: OrderContainer;
  private obsArray: Array<Order>;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8'});
  private options = {headers: this.headers };

  constructor(private authService: AuthService,
              private router: Router,
              private http: HttpClient,
              private localStorage: LocalStorage ) {
      const ordersPersist = this.localStorage.getItem('orders');
      if (ordersPersist) {
        this.orderContainer = JSON.parse(ordersPersist);
        if (!this.orderContainer.orders) {
          this.orderContainer = new OrderContainer();
        }
      }
      if (!this.orderContainer) {
        this.orderContainer = new OrderContainer();
      }
  }


  newOrder(shoe: any, imageGroup: any, size: String ) {
    let order = this.orderContainer.orders.find(o => o.shoe._id === shoe._id && o.imageGroup.color === imageGroup.color && o.size === size);
    if (!order) {
      order = new Order();
      order.shoe = shoe;
      order.imageGroup = imageGroup;
      order.size = size;
      this.orderContainer.orders.push(order);
    }
    order.amount++;
    this.persist();
  }

  totalAmount() {
    let totalAmount = 0;
    this.orderContainer.orders.forEach(o => {
      totalAmount += o.amount;
    });
    return totalAmount;
  }

  subTotal() {
    let subTotal = 0;
    this.orderContainer.orders.forEach(o => {
      subTotal += o.amount * o.shoe.finalPrice;
    });
    return Number(subTotal.toFixed(2));
  }

  cleanOrders() {
    this.orderContainer.orders = [];
    this.persist()
  }

  shippment() {
    if (this.orderContainer.delivery === 'SelfPick') {
      return 0;
    }
    if (this.orderContainer.delivery === 'Mail') {
      if (this.subTotal() < 200) {
        return 15;
      } else {
        return 0;
      }
    }
    if (this.orderContainer.delivery === 'Delivery') {
      return 35;
    }
  }

  deliveryMethod() {
    return this.orderContainer.delivery.toString();
  }

  total() {
    return Number(this.subTotal() + this.shippment()).toFixed(2);
  }

  getOrders() {
    return this.orderContainer.orders;
  }

  getOrdersCounter(): Observable<any> {
    return Observable.from(this.orderContainer.orders);
  }

  removeOrder(order) {
    const index = this.orderContainer.orders.indexOf(order);
    this.orderContainer.orders.splice(index, 1);
    this.persist();
  }



  persist() {
     this.localStorage.setItem('orders', JSON.stringify(this.orderContainer));
  }


  createServerOrder(): Observable<any> {
    const serverOrder = {
      status: 'created',
      totalPrice: this.total(),
      customer: {
        name         : this.orderContainer.name,
        email        : this.orderContainer.email,
        phone        : this.orderContainer.phone,
        address1     : this.orderContainer.address1,
        address2     : this.orderContainer.address2,
        city         : this.orderContainer.city,
        zip          : this.orderContainer.zip
      },
      items    : [],
      shippment: {
        deliveryMethod : this.deliveryMethod(),
        price : this.shippment()
      }
    };
    this.orderContainer.orders.forEach(o => {
      const item = {
        model:  o.shoe.name,
        company: o.shoe.company,
        imageUrl: o.imageGroup.images[0].urlMedium,
        size: o.size,
        color: o.imageGroup.color,
        amount: o.amount,
        pricePerItem: o.shoe.finalPrice,
        sku: o.shoe.id
      }
      serverOrder.items.push(item);
    });
    return this.http.post('/api/order', JSON.stringify(serverOrder), this.options);
  }

  createServerOrderStatus(orderId, newStatus, ppData): Observable<any> {
    return this.http.post(`/api/order/${orderId}/${newStatus}`, JSON.stringify(ppData), this.options);
  }

}
