import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';

@Injectable()
export class AuthService {
  public loggedIn = false;
  public isAdmin = false;
  public isGuest = false;

  currentUser = { _id: '', username: '', role: '' };

  constructor(private userService: UserService,
              private router: Router) {
  }


  loadUser() {
    this.userService.me().subscribe(
      data => {
        if (data && data !== '0') {
          this.setCurrentUser(data);
        } else {
          this.logout();
        }
      });
  }

  injectUser(user) {
    this.setCurrentUser(user);
  }

  login(emailAndPassword) {
    return this.userService.login(emailAndPassword);
  }

  logout() {
    this.loggedIn = false;
    this.isAdmin = false;
    this.isGuest = false;
    this.currentUser = { _id: '', username: '', role: '' };
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
