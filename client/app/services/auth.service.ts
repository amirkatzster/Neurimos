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
  jwtHelper: JwtHelper = new JwtHelper();

  currentUser = { _id: '', username: '', role: '' };

  constructor(private userService: UserService,
              private router: Router,
              private fb: FacebookService) {
    const initParams: InitParams = {
      appId: '1764565033853258',
      xfbml: true,
      version: 'v2.11'
    };
    this.loadUser();
    const user = localStorage.getItem('user');
    if (user) {
      this.setCurrentUser(user);
    } else {
      fb.init(initParams);
      // Check facebook...
      this.fb.getLoginStatus().then(res => {
        if (status === 'connected') {
          const userId = res.authResponse.userID;
          //this.fbLogin(userId);
        }
      });
    }
  }

  loadUser() {
    this.userService.me().subscribe(
      data => {
        if (data && data !== '0') {
          localStorage.setItem('user', data);
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
