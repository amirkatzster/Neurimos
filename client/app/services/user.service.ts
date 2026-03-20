import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  private options = { headers: this.headers };

  constructor(private http: HttpClient) { }

  register(user): Observable<any> {
    return this.http.post('/api/user', JSON.stringify(user), this.options);
  }

  signup(user): Observable<any> {
    return this.http.post('/api/auth/signup', JSON.stringify(user), this.options);
  }

  login(credentials): Observable<any> {
    return this.http.post('/api/auth/login', JSON.stringify(credentials), this.options);
  }

  me(): Observable<any> {
    return this.http.get('/api/auth/me');
  }

  getUsers(): Observable<any> {
    return this.http.get('/api/users');
  }

  countUsers(): Observable<any> {
    return this.http.get('/api/users/count');
  }

  addUser(user): Observable<any> {
    return this.http.post('/api/user', JSON.stringify(user), this.options);
  }

  getUser(user): Observable<any> {
    return this.http.get(`/api/user/${user._id}`);
  }

  editUser(user): Observable<any> {
    return this.http.put(`/api/user/${user._id}`, JSON.stringify(user), this.options);
  }

  deleteUser(user): Observable<any> {
    return this.http.delete(`/api/user/${user._id}`, this.options);
  }

  updateAddressForUser(user, address): Observable<any> {
    return this.http.post(`/api/user/${user._id}/address`, JSON.stringify(address), this.options);
  }

}
