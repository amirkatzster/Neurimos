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

  getShoeByFriendlyId(id): Observable<any> {
    return this.http.get(`/api/shoe/friendly/${id}`).map(res => res);
  }

  editShoe(shoe): Observable<any> {
    return this.http.put(`/api/shoe/${shoe._id}`, JSON.stringify(shoe), this.options);
  }

  deleteShoe(shoe): Observable<any> {
    return this.http.delete(`/api/shoe/${shoe._id}`, this.options);
  }

  getShoeLinkByImage(shoe, imageIndex) {
    const colors = shoe.imagesGroup.map(ig => ig.color).join('-');
    const niceName = shoe.name.replace(/\s+/g, '-').toLowerCase();
    const niceCompany = shoe.company.replace(/\s+/g, '-').toLowerCase();
    return `/נעל/${shoe.company}-${niceName}-${colors}/${shoe.id}/צבע/${shoe.imagesGroup[imageIndex].color}`;
  }

  getShoeLink(shoe) {
    return this.getShoeLinkByImage(shoe, 0);
  }

}
