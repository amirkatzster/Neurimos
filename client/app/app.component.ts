import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth: AuthService, router: Router, @Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      auth.loadUser(() => {
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
          sessionStorage.removeItem('returnUrl');
          router.navigateByUrl(returnUrl);
        }
      });
    }

    router.events.subscribe(e => {
      if (e instanceof NavigationEnd && isPlatformBrowser(platformId)) {
        document.documentElement.scrollTop = 0;
      }
    });
  }

}
