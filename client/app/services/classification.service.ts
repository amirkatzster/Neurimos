import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ClassificationService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8'});
  private options = {headers: this.headers };

  constructor(private http: HttpClient) { }

  getClassifications(): Observable<any> {
    return this.http.get('/api/classifications').map(res => res);
  }

  countClassifications(): Observable<any> {
    return this.http.get('/api/classifications/count').map(res => res);
  }

  getHeader(): Observable<any> {
    return this.http.get('/api/header').map(res => res);
  }

  addClassification(Classification): Observable<any> {
    return this.http.post('/api/classification', JSON.stringify(Classification), this.options);
  }

  getClassification(Classification): Observable<any> {
    return this.http.get(`/api/classification/${Classification._id}`).map(res => res);
  }

  editClassification(Classification): Observable<any> {
    return this.http.put(`/api/classification/${Classification._id}`, JSON.stringify(Classification), this.options);
  }

  deleteClassification(Classification): Observable<any> {
    return this.http.delete(`/api/classification/${Classification._id}`, this.options);
  }


}
