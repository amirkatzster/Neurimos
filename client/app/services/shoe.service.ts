import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ShoeService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getShoes(): Observable<any> {
    return this.http.get('/api/shoes').map(res => res.json());
  }

  countShoes(): Observable<any> {
    return this.http.get('/api/shoes/count').map(res => res.json());
  }

  searchShoes(query: String[], queryString: String): Observable<any> {
    return this.http.post('/api/shoes/search' + queryString, JSON.stringify(query), this.options).map(res => res.json());
  }

  addShoe(shoe): Observable<any> {
    return this.http.post('/api/shoe', JSON.stringify(shoe), this.options);
  }

  getShoe(shoe): Observable<any> {
    return this.http.get(`/api/shoe/${shoe._id}`).map(res => res.json());
  }

  getShoeById(id): Observable<any> {
    return this.http.get(`/api/shoe/${id}`).map(res => res.json());
  }

  editShoe(shoe): Observable<any> {
    return this.http.put(`/api/shoe/${shoe._id}`, JSON.stringify(shoe), this.options);
  }

  deleteShoe(shoe): Observable<any> {
    return this.http.delete(`/api/shoe/${shoe._id}`, this.options);
  }

  getShoeLink(shoe) {
    const colors = shoe.imagesGroup.map(ig => ig.color).join('-');
    return `/${shoe.company}-${shoe.name}-${colors}/נעל/${shoe._id}/צבע/${shoe.imagesGroup[0].color}`;
  }

}
