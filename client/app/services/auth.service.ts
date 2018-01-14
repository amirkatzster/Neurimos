import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper, AuthHttp } from 'angular2-jwt';

import { UserService } from '../services/user.service';
import { FacebookService, InitParams, LoginResponse, AuthResponse } from 'ngx-facebook';
import { debug } from 'util';

@Injectable()
export class AuthService {
  public loggedIn = false;
  public isAdmin = false;
  public isGuest = false;

  currentUser = { _id: '', username: '', role: '' };

  constructor(private userService: UserService,
              private router: Router,
              private fb: FacebookService) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.setCurrentUser(user);
    } else {
      this.loadUser();
    }
  }


  loadUser() {
    this.userService.me().subscribe(
      data => {
        if (data && data !== '0') {
          localStorage.setItem('user', JSON.stringify(data));
          this.setCurrentUser(data);
        }
      });
  }

  injectUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.setCurrentUser(user);
  }

  login(emailAndPassword) {
    return this.userService.login(emailAndPassword);
  }

  logout() {
    localStorage.removeItem('user');
    this.loggedIn = false;
    this.isAdmin = false;
    this.isGuest = false;
    this.currentUser = { _id: '', username: '', role: '' };
    this.router.navigate(['/']);
  }

  setCurrentUser(decodedUser) {
    this.loggedIn = true;
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.role = decodedUser.role;
    decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
    decodedUser.role === 'guest' ? this.isGuest = true : this.isGuest = false;
    delete decodedUser.role;
  }

}
