import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  email = new FormControl('', [Validators.required,
                                       Validators.minLength(3),
                                       Validators.maxLength(100)]);
  password = new FormControl('', [Validators.required,
                                          Validators.minLength(6)]);

  constructor(private auth: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              private title: Title,
              private meta: Meta) {
                this.title.setTitle('התחברות | נעלי נעורים');
                this.meta.updateTag({ name: 'keywords', content: 'התחבר' });
              }

  ngOnInit() {
    if (this.auth.loggedIn) {
      if (this.auth.currentUser.role === 'guest') {
        this.auth.logout();
      } else {
        this.router.navigate(['/']);
      }
    }
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }
  setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe(
      res => {
        this.auth.loadUser();
        this.router.navigate(['/']);
      },
      error => this.toast.setMessage('invalid email or password!', 'danger')
    );
  }
}
