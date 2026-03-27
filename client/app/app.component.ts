import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthService, router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        document.documentElement.scrollTop = 0;
      }
    });
  }

}
