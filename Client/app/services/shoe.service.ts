import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ShoeService {

  // private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
 // private options = new RequestOptions({ headers: this.headers });

  constructor(private authHttp: AuthHttp) { }

  getShoes(): Observable<any> {
    return this.authHttp.get('/api/shoes').map(res => res.json());
  }

  countShoes(): Observable<any> {
    return this.authHttp.get('/api/shoes/count').map(res => res.json());
  }

  addShoe(shoe): Observable<any> {
    return this.authHttp.post('/api/shoe', JSON.stringify(shoe));
  }

  getShoe(shoe): Observable<any> {
    return this.authHttp.get(`/api/shoe/${shoe._id}`).map(res => res.json());
  }

  editShoe(shoe): Observable<any> {
    return this.authHttp.put(`/api/shoe/${shoe._id}`, JSON.stringify(shoe));
  }

  deleteShoe(shoe): Observable<any> {
    return this.authHttp.delete(`/api/shoe/${shoe._id}`);
  }

}
