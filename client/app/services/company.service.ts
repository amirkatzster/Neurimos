import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CompanyService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getCompanies(): Observable<any> {
    return this.http.get('/api/companies').map(res => res.json());
  }

  countCompanies(): Observable<any> {
    return this.http.get('/api/companies/count').map(res => res.json());
  }

  addCompany(Company): Observable<any> {
    return this.http.post('/api/company', JSON.stringify(Company), this.options);
  }

  getCompany(Company): Observable<any> {
    return this.http.get(`/api/company/${Company._id}`).map(res => res.json());
  }

  getCompanyById(id): Observable<any> {
    return this.http.get(`/api/company/${id}`).map(res => res.json());
  }

  editCompany(Company): Observable<any> {
    return this.http.put(`/api/company/${Company._id}`, JSON.stringify(Company), this.options);
  }

  deleteCompany(Company): Observable<any> {
    return this.http.delete(`/api/company/${Company._id}`, this.options);
  }

}
