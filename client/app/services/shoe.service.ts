import { Injectable, Inject, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ShoeService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8'});
  private options = {headers: this.headers };

  constructor(private http: HttpClient) {}

  getShoes(): Observable<any> {
    return this.http.get(`/api/shoes`).map(res => res);
  }

  countShoes(): Observable<any> {
    return this.http.get(`/api/shoes/count`).map(res => res);
  }

  searchShoes(query: String[], queryString: String): Observable<any> {
    return this.http.post(`/api/shoes/search${queryString}`,
    JSON.stringify(query), this.options).map(res => res);
  }

  addShoe(shoe): Observable<any> {
    return this.http.post(`/api/shoe`, JSON.stringify(shoe), this.options);
  }

  getShoe(shoe): Observable<any> {
    return this.http.get(`/api/shoe/${shoe._id}`).map(res => res);
  }

  getShoeById(id): Observable<any> {
    return this.http.get(`/api/shoe/${id}`).map(res => res);
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
