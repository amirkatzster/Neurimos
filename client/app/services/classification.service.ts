import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ClassificationService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  private options = { headers: this.headers };

  constructor(private http: HttpClient) { }

  getClassifications(): Observable<any> {
    return this.http.get('/api/classifications');
  }

  countClassifications(): Observable<any> {
    return this.http.get('/api/classifications/count');
  }

  getHeader(): Observable<any> {
    return this.http.get('/api/header');
  }

  addClassification(Classification): Observable<any> {
    return this.http.post('/api/classification', JSON.stringify(Classification), this.options);
  }

  getClassification(Classification): Observable<any> {
    return this.http.get(`/api/classification/${Classification._id}`);
  }

  editClassification(Classification): Observable<any> {
    return this.http.put(`/api/classification/${Classification._id}`, JSON.stringify(Classification), this.options);
  }

  deleteClassification(Classification): Observable<any> {
    return this.http.delete(`/api/classification/${Classification._id}`, this.options);
  }

}
