import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ClassificationService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getClassifications(): Observable<any> {
    return this.http.get('/api/classifications').map(res => res.json());
  }

  countClassifications(): Observable<any> {
    return this.http.get('/api/classifications/count').map(res => res.json());
  }

  getHeaderClassification(): Observable<any> {
    return this.http.get('/api/classification/header').map(res => res.json());
  }

  addClassification(Classification): Observable<any> {
    return this.http.post('/api/classification', JSON.stringify(Classification), this.options);
  }

  getClassification(Classification): Observable<any> {
    return this.http.get(`/api/classification/${Classification._id}`).map(res => res.json());
  }

  editClassification(Classification): Observable<any> {
    return this.http.put(`/api/classification/${Classification._id}`, JSON.stringify(Classification), this.options);
  }

  deleteClassification(Classification): Observable<any> {
    return this.http.delete(`/api/classification/${Classification._id}`, this.options);
  }

  

}
