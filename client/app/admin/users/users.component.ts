import { Component, OnInit } from '@angular/core';

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  standalone: false,
  selector: 'app-users-admin',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users = [];
  isLoading = true;
  selectedUser: any = null;

  constructor(public auth: AuthService,
              public toast: ToastComponent,
              private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => this.users = data.sort((a, b) => (a.role === 'admin' ? -1 : 1) - (b.role === 'admin' ? -1 : 1)),
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  selectUser(user) {
    this.selectedUser = JSON.parse(JSON.stringify(user));
  }

  isOwnUser(): boolean {
    return this.selectedUser && this.auth.currentUser._id === this.selectedUser._id;
  }

  saveUser(user) {
    this.userService.editUser(user).subscribe(
      () => {
        this.toast.setMessage('פרטים עודכנו בהצלחה', 'success');
        this.selectedUser = null;
        this.getUsers();
      },
      error => console.log(error)
    );
  }

  confirmDelete(user) {
    if (confirm(`למחוק את ${user.username}?`)) {
      this.deleteUser(user);
    }
  }

  deleteUser(user) {
    this.userService.deleteUser(user).subscribe(
      () => {
        this.toast.setMessage('משתמש הוסר בהצלחה', 'success');
        this.selectedUser = null;
        this.getUsers();
      },
      error => console.log(error)
    );
  }

}
