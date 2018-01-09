import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper, AuthHttp } from 'angular2-jwt';

import { UserService } from '../services/user.service';
import { FacebookService, InitParams, LoginResponse, AuthResponse } from 'ngx-facebook';
import { debug } from 'util';

@Injectable()
export class AuthService {
  loggedIn = false;
  isAdmin = false;

  currentUser = { _id: '', username: '', role: '' };

  constructor(private userService: UserService,
              private router: Router,
              private fb: FacebookService) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      console.log('set user');
      this.setCurrentUser(user);
    } else {
      console.log('load user');
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

  login(emailAndPassword) {
    return this.userService.login(emailAndPassword);
  }

  logout() {
    localStorage.removeItem('user');
    this.loggedIn = false;
    this.isAdmin = false;
    this.currentUser = { _id: '', username: '', role: '' };
    this.router.navigate(['/']);
  }

  setCurrentUser(decodedUser) {
    this.loggedIn = true;
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.role = decodedUser.role;
    decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
    delete decodedUser.role;
  }

}
