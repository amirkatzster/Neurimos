import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  private options = { headers: this.headers };

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<any> {
    return this.http.get('/api/companies');
  }

  countCompanies(): Observable<any> {
    return this.http.get('/api/companies/count');
  }

  addCompany(Company): Observable<any> {
    return this.http.post('/api/company', JSON.stringify(Company), this.options);
  }

  getCompany(Company): Observable<any> {
    return this.http.get(`/api/company/${Company._id}`);
  }

  getCompanyById(id): Observable<any> {
    return this.http.get(`/api/company/${id}`);
  }

  editCompany(Company): Observable<any> {
    return this.http.put(`/api/company/${Company._id}`, JSON.stringify(Company), this.options);
  }

  deleteCompany(Company): Observable<any> {
    return this.http.delete(`/api/company/${Company._id}`, this.options);
  }

}
