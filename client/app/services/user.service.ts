import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private authHttp: AuthHttp) { }

  register(user): Observable<any> {
    return this.authHttp.post('/api/user', JSON.stringify(user));
  }

  login(credentials): Observable<any> {
    return this.authHttp.post('/api/login', JSON.stringify(credentials));
  }

  getUsers(): Observable<any> {
    return this.authHttp.get('/api/users').map(res => res.json());
  }

  countUsers(): Observable<any> {
    return this.authHttp.get('/api/users/count').map(res => res.json());
  }

  addUser(user): Observable<any> {
    return this.authHttp.post('/api/user', JSON.stringify(user));
  }

  getUser(user): Observable<any> {
    return this.authHttp.get(`/api/user/${user._id}`).map(res => res.json());
  }

  editUser(user): Observable<any> {
    return this.authHttp.put(`/api/user/${user._id}`, JSON.stringify(user));
  }

  deleteUser(user): Observable<any> {
    return this.authHttp.delete(`/api/user/${user._id}`);
  }

}
